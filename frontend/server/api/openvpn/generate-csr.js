import backendApi from '../../utils/api'

export default defineEventHandler(async (event) => {
    const result = await readBody(event)
    const mutationGenerateCsr = `
        mutation {
            createCSR(name: "${result.clientName}") {
                commandId
                status
                output
            }
        }
    `
    let response = await backendApi.post('/api/v1/', {
        query: mutationGenerateCsr,
    })

    let { data } = response.data
    
    if (data.errors) {
        throw createError({ statusCode: 403, statusMessage: data.errors[0].message })
    }
  
    return {
        commandId: data.createCSR.commandId,
        status: data.createCSR.status,
        output: data.createCSR.output,
    }
})