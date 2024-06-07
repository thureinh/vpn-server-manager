import axios from 'axios';

const backendApi = axios.create({
    baseURL: process.env.BACKEND_ADDRESS,
})

backendApi.interceptors.request.use((config) => {
    const token = getToken('accessToken')
    console.log('stored access token:', token)
    console.log('base url:', process.env.BACKEND_ADDRESS)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

export default backendApi