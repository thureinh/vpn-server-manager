import axios from 'axios';

const backendApi = axios.create({
    baseURL: 'http://express:3000',
})

backendApi.interceptors.request.use((config) => {
    const token = getToken('accessToken')
    console.log('stored access token:', token)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

export default backendApi
