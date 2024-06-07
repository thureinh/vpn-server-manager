const { objectType, mutationType, extendType } = require('nexus')
const { ec2 } = require('../aws')

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
    },
})

module.exports = {
    CaServer,
    CaQuery,
    CaMutation,
}
