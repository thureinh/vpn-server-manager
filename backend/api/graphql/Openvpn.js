const { objectType, mutationType, extendType } = require('nexus')
const { ec2, ssm } = require('../aws')

const VpnServer = objectType({
    name: 'VpnServer',
    definition(t) {
        t.nonNull.string('instanceId')
        t.nonNull.string('state')
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

        t.field('testVpnSSH', {
            type: 'VpnServer',
            resolve: async () => {
                const params = {
                    DocumentName: 'AWS-RunShellScript',
                    InstanceIds: [process.env.OPENVPN_INSTANCE_ID],
                    Parameters: {
                        'commands': [
                            'cd /home/ubuntu',
                            'ls -l'
                        ],
                    },
                }

                ssm.sendCommand(params, (err, data) => {
                    if (err) {
                        console.log(err, err.stack)
                    } else {
                        setTimeout(() => {
                            const commandId = data.Command.CommandId

                            ssm.getCommandInvocation({
                                CommandId: commandId,
                                InstanceId: process.env.OPENVPN_INSTANCE_ID,
                            }, (err, data) => {
                                if (err) {
                                    console.log(err, err.stack)
                                } else {
                                    console.log(data.StandardOutputContent)
                                }
                            })
                        }, 5000)
                    }
                })

                return {
                    instanceId: 'i-1234567890abcdef0',
                    state: 'running',
                }
            },
        })
    },
})

module.exports = {
    VpnServer,
    VpnQuery,
    VpnMutation,
}
