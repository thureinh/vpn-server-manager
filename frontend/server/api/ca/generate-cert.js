import backendApi from '../../utils/api'

export default defineEventHandler(async (event) => {
    const result = await readBody(event)
    const mutationGenerateCert = `
        mutation {
            createCert(name: "${result.clientName}") {
                commandId
                status
                output
            }
        }
    `
    let response = await backendApi.post('/api/v1/', {
        query: mutationGenerateCert,
    })

    let { data } = response.data
    
    if (data.errors) {
        throw createError({ statusCode: 403, statusMessage: data.errors[0].message })
    }
  
    return {
        commandId: data.createCert.commandId,
        status: data.createCert.status,
        output: data.createCert.output,
    }
})