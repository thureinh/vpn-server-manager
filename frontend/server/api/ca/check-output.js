import backendApi from '../../utils/api';

export default defineEventHandler(async (event) => {
    const result = await readBody(event)
    const queryServerState = `
        {
            checkCaCommandOutput(commandId: "${ result.commandId }") {
                commandId
                status
                output
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
        commandId: data.checkCaCommandOutput.commandId,
        status: data.checkCaCommandOutput.status,
        output: data.checkCaCommandOutput.output,
    }
})