import backendApi from '../../utils/api';

export default defineEventHandler(async (event) => {
    const mutationServerStop = `
        mutation {
            stopCaServer {
                instanceId
                state
            }
        }
    `
    let response = await backendApi.post('/api/v1/', {
        query: mutationServerStop,
    })

    let { data } = response.data
    
    if (data.errors) {
        throw createError({ statusCode: 403, statusMessage: data.errors[0].message })
    }
  
    return {
        state: data.stopCaServer.state,
    }
})