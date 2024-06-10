import backendApi from '../../utils/api';

export default defineEventHandler(async (event) => {
    const result = await readBody(event)
    const queryServerState = `
        query {
            getS3Url(s3Url: "${ result.s3Url }") 
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
        s3Url: data.getS3Url,
    }
})