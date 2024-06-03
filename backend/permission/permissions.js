const { shield, and, not, or } = require('graphql-shield')
const rules = require('./rules')

const permissions = shield({
    Query: rules.isAuthenticated,
    Mutation: or(and(rules.isAuthenticated, not(rules.isLoginMutation)), rules.isLoginMutation),
})

module.exports = permissions