import { verify } from 'jsonwebtoken'
import { SECRET } from './login.post'

const TOKEN_TYPE = 'Bearer'

const extractToken = (authHeaderValue) => {
  const [, token] = authHeaderValue.split(`${TOKEN_TYPE} `)
  return token
}

const ensureAuth = (event) => {
  const authHeaderValue = getRequestHeader(event, 'authorization')
  if (typeof authHeaderValue === 'undefined') {
    throw createError({ statusCode: 403, statusMessage: 'Need to pass valid Bearer-authorization header' })
  }

  const extractedToken = extractToken(authHeaderValue)
  try {
    return verify(extractedToken, SECRET)
  } catch (error) {
    console.error('Login failed. Here\'s the raw error:', error)
    throw createError({ statusCode: 403, statusMessage: 'You must be logged in to use this endpoint' })
  }
}

export default defineEventHandler((event) => {
  const user = ensureAuth(event)
  return user
})