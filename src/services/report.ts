import { apiService } from './axios/config'
import { IReport, IReportExpenses, IReportRequest } from '@interfaces/report'

export const getReports = async (): Promise<IReport[]> => {
  try {
    const { data } = await apiService.get('/reports')
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const getReportsApproved = async (): Promise<IReport[]> => {
  try {
    const { data } = await apiService.get('/reports/approved')
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

export const getReportExpenses = async ({ id }: { id: string }): Promise<IReportExpenses> => {
  try {
    const { data } = await apiService.get(`/reports/${id}/expenses`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const createReport = async (props: IReportRequest) => {
  try {
    const { data } = await apiService.post(`/reports/create`, props)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}
export const editReport = async ({ id, ...props }: IReportRequest) => {
  try {
    const { data } = await apiService.put(`/reports/${id}/update`, props)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const editReportSendProgress = async ({ id }: { id?: string }) => {
  try {
    const { data } = await apiService.put(`/reports/${id}/send-process`)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const editReportApprove = async ({ id }: { id?: string }) => {
  try {
    const { data } = await apiService.put(`/reports/${id}/approve`)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const deleteReport = async ({ id }: { id: string }) => {
  try {
    const { data } = await apiService.delete(`/reports//${id}/delete`)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}
