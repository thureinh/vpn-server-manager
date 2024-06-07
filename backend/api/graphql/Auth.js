const { inputObjectType, extendType, objectType, stringArg, nonNull } = require('nexus')
const { User } = require('./User')
const bcrypt = require('bcryptjs')
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require('../jwt')

const LoginInput = inputObjectType({
    name: 'LoginInputType',
    definition(t) {
        t.nonNull.string('name')
        t.nonNull.string('password')
    }
})

const AuthPayload = objectType({
    name: 'AuthPayload',
    definition(t) {
        t.nonNull.string('token')
        t.field('user', { type: User })
    },
})

const AuthMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('login', {
            type: 'AuthPayload',
            args: { data: LoginInput },
            async resolve(_root, args, ctx) {
                console.log('db_url', process.env.DB_URL)
                const payload = args.data
                const user = await ctx.db.user.findUnique({ where: { name: payload.name } })
                if (null !== user && bcrypt.compareSync(payload.password, user.password)) {
                    let accessToken, refreshToken = undefined
                    try {
                        accessToken = createAccessToken(user)
                        refreshToken = createRefreshToken(user)
                        await ctx.db.user.update({
                            where: { id: user.id },
                            data: { refreshToken },
                        })
                    }catch(error){
                        console.error(error)
                    }
                    return { token: accessToken, user }
                }
                return { token: '', user }
            }
        })
        t.field('refreshToken', {
            type: 'AuthPayload',
            args: { refreshToken: nonNull(stringArg()) },
            async resolve(_root, args, _ctx) {
                const user = verifyRefreshToken(args.refreshToken)
                if (null !== user) {
                    const accessToken = createAccessToken(user)
                    return { token: accessToken, user }
                }
                return { token: '', user }
            }
        })
        t.field('logout', {
            type: 'Boolean',
            async resolve(_root, _args, ctx) {
                try{
                    await ctx.db.user.update({
                        where: { id: ctx.user.id },
                        data: { refreshToken: null },
                    })
                }catch(error){
                    console.error(error)
                    return false
                }
                return true
            }
        })
    },
})

module.exports = { LoginInput, AuthPayload, AuthMutation }