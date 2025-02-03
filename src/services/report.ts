import { apiService } from './axios/config'
import { IReport } from '@interfaces/report'

export const getReports = async (): Promise<IReport[]> => {
  try {
    const { data } = await apiService.get('/reports')
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const getReport = async ({ id }: { id: string }): Promise<IReport> => {
  try {
    const { data } = await apiService.get(`/reports/${id}`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}
