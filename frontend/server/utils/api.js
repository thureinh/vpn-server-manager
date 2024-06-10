import axios from 'axios';

const backendApi = axios.create({
    baseURL: process.env.BACKEND_ADDRESS,
})

backendApi.interceptors.request.use((config) => {
    const token = getToken('accessToken')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

export default backendApi