import backendApi from '../../utils/api';
import { setToken } from '../../utils/tokenStore';

export const SECRET = 'lawson' // put to env file later

export default defineEventHandler(async (event) => {

    const result = await readBody(event)
    const mutationLogin = `
        mutation Login($username: String!, $password: String!) {
            login(data: { name: $username, password: $password }) {
                token
                user {
                    id
                    name
                    email
                }
            }
        }
    `

    const queryUser = `
        query GetUser($username: String!) {
            user(username: $username) {
                id
                name
                email
                refreshToken
            }
        }
    `

    const variables = {
        username: result.username,
        password: result.password,
    };

    let response = await backendApi.post('/api/v1/', {
        query: mutationLogin,
        variables,
    });

    let { data } = response.data;
    
    if (data.errors) {
        throw createError({ statusCode: 403, statusMessage: data.errors[0].message });
    }

    const accessToken = data.login.token
    setToken('accessToken', accessToken)

    response = await backendApi.post('/api/v1/', {
        query: queryUser,
        variables,
    })

    const user = response.data.data.user
    const refreshToken = user.refreshToken

    return {
        token: {
            accessToken,
            refreshToken
        }
    }
})