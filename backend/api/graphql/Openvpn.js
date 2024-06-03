const { objectType, mutationType } = require('nexus')
const { ec2 } = require('../aws')

const OPENVPN_INSTANCE_ID = 'i-00d97b626c0dcdcad'

const VpnServer = objectType({
    name: 'VpnServer',
    definition(t) {
        t.nonNull.string('instanceId')
        t.nonNull.string('state')
    },
})

const Mutation = mutationType({
    definition(t) {
        t.field('startVpnServer', {
            type: 'VpnServer',
            resolve: async () => {
                const params = {
                    InstanceIds: [OPENVPN_INSTANCE_ID],
                };

                const result = await ec2.startInstances(params).promise()

                return {
                    instanceId: result.StartingInstances[0].InstanceId,
                    state: result.StartingInstances[0].CurrentState.Name,
                };
            },
        })

        t.field('stopVpnServer', {
            type: 'VpnServer',
            resolve: async () => {
                const params = {
                    InstanceIds: [OPENVPN_INSTANCE_ID],
                }

                const result = await ec2.stopInstances(params).promise()

                return {
                    instanceId: result.StoppingInstances[0].InstanceId,
                    state: result.StoppingInstances[0].CurrentState.Name,
                }
            },
        })

        t.field('getVpnServerState', {
            type: 'VpnServer',
            resolve: async () => {
                const params = {
                    InstanceIds: [OPENVPN_INSTANCE_ID],
                }

                const result = await ec2.describeInstances(params).promise()

                return {
                    instanceId: result.Reservations[0].Instances[0].InstanceId,
                    state: result.Reservations[0].Instances[0].State.Name,
                };
            },
        })
    },
})

module.exports = {
    VpnServer,
    Mutation,
}
