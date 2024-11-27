import { ILogin } from '@interfaces/auth'
import { apiService } from './axios/config'

export const login = async (props: ILogin) => {
  try {
    const { data } = await apiService.post('/auth/login', props)
    localStorage.setItem('AUTH_TOKEN', data?.data?.token)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const getDetail = async () => {
  const { data } = await apiService.get('/users/detail')
  return data?.data
}
