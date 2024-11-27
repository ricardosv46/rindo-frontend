import { ICompany } from '@interfaces/company'
import { apiService } from './axios/config'

export const getCompanies = async (): Promise<ICompany[]> => {
  try {
    const { data } = await apiService.get('/companies')
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const createCompany = async (props: ICompany) => {
  try {
    const { data } = await apiService.post(`/companies/create`, props)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const updateCompany = async ({ id, ...props }: ICompany) => {
  try {
    const { data } = await apiService.put(`/companies/${id}/update`, props)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const deleteCompany = async ({ id }: { id: string }) => {
  try {
    const { data } = await apiService.delete(`/companies/${id}/delete`)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}
