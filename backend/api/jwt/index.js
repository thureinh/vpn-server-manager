const jwt = require('jsonwebtoken')

function createAccessToken(user) {
    const tokenObj = {
        id: user.id,
        name: user.name,
    }
    return jwt.sign({ user: tokenObj }, process.env.JWT_SECRET_KEY, {
        expiresIn: '1h',
    })
}

function createRefreshToken(user) {
    const tokenObj = {
        id: user.id,
        name: user.name,
    }
    return jwt.sign({ user: tokenObj }, process.env.JWT_REFRESH_KEY, {
        expiresIn: '7d',
    })
}

function verifyAccessToken(accessToken) {
    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY)
        return decoded.user
    } catch (error) {
        console.error(error)
        return null
    }
}

function verifyRefreshToken(refreshToken) {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY)
        return decoded.user
    } catch (error) {
        console.error(error)
        return null
    }
}

module.exports = { createAccessToken, createRefreshToken, verifyRefreshToken, verifyAccessToken }