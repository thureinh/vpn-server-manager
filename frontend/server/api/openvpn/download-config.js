import backendApi from '../../utils/api'

export default defineEventHandler(async (event) => {
    const result = await readBody(event)
    const mutationDownloadConfig = `
        mutation {
            createConfig(name: "${result.clientName}") {
                commandId
                status
                output
            }
        }
    `
    let response = await backendApi.post('/api/v1/', {
        query: mutationDownloadConfig,
    })

    let { data } = response.data
    
    if (data.errors) {
        throw createError({ statusCode: 403, statusMessage: data.errors[0].message })
    }
  
    return {
        commandId: data.createConfig.commandId,
        status: data.createConfig.status,
        output: data.createConfig.output,
    }
})