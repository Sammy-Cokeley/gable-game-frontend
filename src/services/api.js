import axios from 'axios'
import setupInterceptors from './http.interceptor'

const API_BASE_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:3000'
    : 'https://gable-game-backend.onrender.com'

const api = axios.create({
    baseURL: API_BASE_URL
})

setupInterceptors(api)

export default api
