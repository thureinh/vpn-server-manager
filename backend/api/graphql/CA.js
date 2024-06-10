const { objectType, extendType, nonNull, stringArg } = require('nexus')
const { ec2, ssm } = require('../aws')

const CaServer = objectType({
    name: 'CaServer',
    definition(t) {
        t.nonNull.string('instanceId')
        t.nonNull.string('state')
    },
})

const CaQuery = extendType({
    type: 'Query',
    definition(t) {
        t.field('getCaServerState', {
            type: 'CaServer',
            resolve: async () => {
                const params = {
                    InstanceIds: [process.env.CA_INSTANCE_ID],
                }

                const result = await ec2.describeInstances(params).promise()

                return {
                    instanceId: result.Reservations[0].Instances[0].InstanceId,
                    state: result.Reservations[0].Instances[0].State.Name,
                }
            },
        })
        t.field('checkCaCommandOutput', {
            type: 'CommandOutput',
            args: {
                commandId: nonNull(stringArg()),
            },
            resolve: async (_, { commandId }) => {
                return new Promise((resolve, reject) => {
                    const params = {
                        CommandId: commandId,
                        InstanceId: process.env.CA_INSTANCE_ID,
                    }

                    ssm.getCommandInvocation(params, (err, data) => {
                        if (err) {
                            console.error(err, err.stack)
                            resolve({
                                commandId: commandId,
                                status: 'FAILED',
                                output: '',
                            })
                        } else {
                            resolve({
                                commandId: data.CommandId,
                                status: data.Status,
                                output: data.StandardOutputContent,
                            })
                        }
                    })
                })
            },
        })
    },
})

const CaMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('startCaServer', {
            type: 'CaServer',
            resolve: async () => {
                const params = {
                    InstanceIds: [process.env.CA_INSTANCE_ID],
                }

                const result = await ec2.startInstances(params).promise()

                return {
                    instanceId: result.StartingInstances[0].InstanceId,
                    state: result.StartingInstances[0].CurrentState.Name,
                }
            },
        })

        t.field('stopCaServer', {
            type: 'CaServer',
            resolve: async () => {
                const params = {
                    InstanceIds: [process.env.CA_INSTANCE_ID],
                }

                const result = await ec2.stopInstances(params).promise()

                return {
                    instanceId: result.StoppingInstances[0].InstanceId,
                    state: result.StoppingInstances[0].CurrentState.Name,
                }
            },
        })

        t.field('createCert', {
            type: 'CommandOutput',
            args: {
                name: nonNull(stringArg()),
            },
            resolve: async (_parent, args, _context, _info) => {
                const { name } = args
                const params = {
                    DocumentName: 'AWS-RunShellScript',
                    InstanceIds: [process.env.CA_INSTANCE_ID],
                    Parameters: {
                        'commands': [
                            `cd /home/ubuntu/`,
                            `./generate_cert.sh ${name}`,
                        ],
                    },
                }

                return new Promise((resolve, reject) => {
                    ssm.sendCommand(params, (err, data) => {
                        if (err) {
                            console.error(err, err.stack)
                            resolve({
                                commandId: '',
                                status: 'FAILED',
                                output: '',
                            })
                        } else {
                            resolve({
                                commandId: data.Command.CommandId,
                                status: data.Command.Status,
                                output: '',
                            })
                        }
                    })
                })
            },
        })
    },
})

module.exports = {
    CaServer,
    CaQuery,
    CaMutation,
}
