const { objectType, extendType, inputObjectType, nonNull, intArg, stringArg } = require('nexus')
const bcrypt = require('bcryptjs')
const saltRounds = parseInt(process.env.SALT_ROUNDS || 10)

const User = objectType({
    name: 'User',
    definition(t) {
        t.int('id', { description: 'User ID' })
        t.string('name', { description: 'User\'s name' })
        t.string('email', { description: 'User\'s email address' })
        t.string('refreshToken', { description: 'User\'s refresh token' })
    }
})

const UserInput = inputObjectType({
    name: 'UserInputType',
    definition(t) {
        t.nonNull.string('name', { description: 'User\'s name' })
        t.nonNull.string('email', { description: 'User\'s email address' })
        t.nonNull.string('password', { description: 'User\'s password' })
    }
})

const UserQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('users', {
            type: 'User',
            resolve(_root, _args, ctx) {
                return ctx.db.user.findMany()
            },
        })
        t.field('user', {
            type: 'User',
            args: {
                username: nonNull(stringArg()),
            },
            resolve: async (_, { username }, ctx) => {
                return ctx.db.user.findUnique({
                    where: { name: username },
                });
            },
        })
    },
})

const UserMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.field('createUser', {
            type: 'User',
            args: { data: nonNull(UserInput) },
            resolve(_root, args, ctx) {
                const user = args.data
                const hashedPassword = bcrypt.hashSync(user.password, saltRounds)
                return ctx.db.user.create({
                    data: {
                        name: user.name,
                        email: user.email,
                        password: hashedPassword,
                    }
                })
            }
        })
        t.field('updateUser', {
            type: 'User',
            args: {
                id: nonNull(intArg()),
                data: nonNull(UserInput),
            },
            resolve(_root, args, ctx) {
                const { id, data } = args
                data.password = bcrypt.hashSync(data.password, saltRounds)
                return ctx.db.user.update({
                    where: { id },
                    data
                })
            },
        })
        t.field('deleteUser', {
            type: 'User',
            args: {
                id: nonNull(intArg()),
            },
            resolve(_root, args, ctx) {
                const { id } = args
                return ctx.db.user.delete({
                    where: { id },
                })
            },
        })
    },
})

module.exports = { User, UserInput, UserQuery, UserMutation }