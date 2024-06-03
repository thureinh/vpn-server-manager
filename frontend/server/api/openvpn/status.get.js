import backendApi from '../../utils/api';

export default defineEventHandler(async (event) => {
    const queryServerState = `
        mutation GetServerState {
            getVpnServerState {
                instanceId
                state
            }
        }
    `;

    let response = await backendApi.post('/api/v1/', {
        query: queryServerState,
    })

    let { data } = response.data

    if (data.errors) {
        throw createError({ statusCode: 403, statusMessage: data.errors[0].message })
    }

    return {
        state: data.getVpnServerState.state,
    }
})
