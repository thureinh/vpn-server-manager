const { objectType, extendType, nonNull, stringArg } = require('nexus')
const { ec2, ssm, s3 } = require('../aws')

const VpnServer = objectType({
    name: 'VpnServer',
    definition(t) {
        t.nonNull.string('instanceId')
        t.nonNull.string('state')
    },
})

const CommandOutput = objectType({
    name: 'CommandOutput',
    definition(t) {
        t.string('commandId')
        t.string('status')
        t.string('output')
    },
})

const VpnQuery = extendType({
    type: 'Query',
    definition(t) {
        t.field('getVpnServerState', {
            type: 'VpnServer',
            resolve: async () => {
                const params = {
                    InstanceIds: [process.env.OPENVPN_INSTANCE_ID],
                }

                const result = await ec2.describeInstances(params).promise()

                return {
                    instanceId: result.Reservations[0].Instances[0].InstanceId,
                    state: result.Reservations[0].Instances[0].State.Name,
                }
            },
        })

        t.field('checkVpnCommandOutput', {
            type: 'CommandOutput',
            args: {
                commandId: nonNull(stringArg()),
            },
            resolve: async (_, { commandId }) => {
                return new Promise((resolve, reject) => {
                    const params = {
                        CommandId: commandId,
                        InstanceId: process.env.OPENVPN_INSTANCE_ID,
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

        t.field('getS3Url', {
            type: 'String',
            args: {
                s3Url: nonNull(stringArg()),
            },
            resolve: async (_, { s3Url }) => {
                const urlParts = s3Url.replace('s3://', '').split('/')
                const Bucket = urlParts.shift()
                const Key = urlParts.join('/')

                const params = {
                    Bucket,
                    Key,
                    Expires: 60 * 5,
                }
                return new Promise((resolve, reject) => {
                    s3.getSignedUrl('getObject', params, (err, url) => {
                        if (err) {
                            console.error(err)
                            resolve('')
                        } else {
                            resolve(url)
                        }
                    })
                })
            },
        })
    },
})

const VpnMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('startVpnServer', {
            type: 'VpnServer',
            resolve: async () => {
                const params = {
                    InstanceIds: [process.env.OPENVPN_INSTANCE_ID],
                }

                const result = await ec2.startInstances(params).promise()

                return {
                    instanceId: result.StartingInstances[0].InstanceId,
                    state: result.StartingInstances[0].CurrentState.Name,
                }
            },
        })

        t.field('stopVpnServer', {
            type: 'VpnServer',
            resolve: async () => {
                const params = {
                    InstanceIds: [process.env.OPENVPN_INSTANCE_ID],
                }

                const result = await ec2.stopInstances(params).promise()

                return {
                    instanceId: result.StoppingInstances[0].InstanceId,
                    state: result.StoppingInstances[0].CurrentState.Name,
                }
            },
        })

        t.field('createCSR', {
            type: 'CommandOutput',
            args: {
                name: nonNull(stringArg()),
            },
            resolve: async (_parent, args, _context, _info) => {
                const { name } = args

                const params = {
                    DocumentName: 'AWS-RunShellScript',
                    InstanceIds: [process.env.OPENVPN_INSTANCE_ID],
                    Parameters: {
                        'commands': [
                            `cd /home/ubuntu/`,
                            `./generate_request.sh ${name}`,
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

        t.field('createConfig', {
            type: 'CommandOutput',
            args: {
                name: nonNull(stringArg()),
            },
            resolve: async (_parent, args, _context, _info) => {
                const { name } = args

                const params = {
                    DocumentName: 'AWS-RunShellScript',
                    InstanceIds: [process.env.OPENVPN_INSTANCE_ID],
                    Parameters: {
                        'commands': [
                            `cd /home/ubuntu/`,
                            `./make_config.sh ${name}`,
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
    VpnServer,
    VpnQuery,
    VpnMutation,
    CommandOutput
}
