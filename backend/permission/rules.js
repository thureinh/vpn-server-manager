const { rule } = require('graphql-shield')

const isAuthenticated = rule()(async (_parent, _args, ctx) => {
    return Object.keys(ctx.user).length !== 0
})

const isLoginMutation = rule()(async (_parent, _args, _ctx, info) => {
    return info.operation.name.value.trim().toLowerCase() === 'login';
})

module.exports = { isAuthenticated, isLoginMutation }
