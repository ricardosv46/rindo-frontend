import axios from 'axios'

export const apiService = axios.create({
  // baseURL: `http://localhost:4001`
  baseURL: `http://192.168.1.67:4001`
})

apiService.interceptors.request.use(function (config) {
  const token = localStorage.getItem('AUTH_TOKEN')
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
})
