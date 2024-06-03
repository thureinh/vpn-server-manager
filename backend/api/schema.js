const { makeSchema } = require('nexus')
const { join } = require('path')
const types = require('./graphql')

module.exports = makeSchema({
    types,
    outputs: {
        typegen: join(__dirname, '..', 'nexus-typegen.ts'),
        schema: join(__dirname, '..', 'schema.graphql'),
    },
})