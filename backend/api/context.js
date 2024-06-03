const { db } = require('./db')
const { verifyAccessToken } = require('./jwt')

const getDynamicContext = (req, _args) => {
    let user = {}
    const token = req.headers.authorization || ''
    if (token && token.startsWith('Bearer ')) {
        try {
            const tokenWithoutBearer = token.split(' ')[1]
            user = verifyAccessToken(tokenWithoutBearer)
        } catch (error) {
            console.error(error)
        }
    }
    return { db, req, user }
}
module.exports = { getDynamicContext }