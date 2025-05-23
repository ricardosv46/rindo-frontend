import { IArea, IAreaRequest } from '@interfaces/area'
import { apiService } from './axios/config'
import { IExpense, IExpenseRequest } from '@interfaces/expense'
import { valuesFormData } from '@lib/utils'
import dayjs, { Dayjs } from 'dayjs'
import { IFilterResponse, IFormFilters } from '@interfaces/filters'

export const getExpenses = async (props: IFormFilters): Promise<IFilterResponse<IExpense[]>> => {
  try {
    const { dateRange, ...rest } = props
    const to = dateRange?.to ? dayjs(dateRange.to).format('DD/MM/YYYY') : ''
    const from = dateRange?.from ? dayjs(dateRange.from).format('DD/MM/YYYY') : ''
    const { data } = await apiService.get('/expenses', {
      params: { ...rest, from, to }
    })
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const getExpensesDraft = async (props: IFormFilters): Promise<IFilterResponse<IExpense[]>> => {
  try {
    const { dateRange, ...rest } = props
    const to = dateRange?.to ? dayjs(dateRange.to).format('DD/MM/YYYY') : ''
    const from = dateRange?.from ? dayjs(dateRange.from).format('DD/MM/YYYY') : ''
    const { data } = await apiService.get('/expenses/draft', {
      params: { ...rest, from, to }
    })
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const getExpensesByReportDraft = async (id: string, props: IFormFilters): Promise<IFilterResponse<IExpense[]>> => {
  try {
    const { dateRange, ...rest } = props
    const to = dateRange?.to ? dayjs(dateRange.to).format('DD/MM/YYYY') : ''
    const from = dateRange?.from ? dayjs(dateRange.from).format('DD/MM/YYYY') : ''
    const { data } = await apiService.get(`/expenses/report/${id}`, {
      params: { ...rest, from, to }
    })
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const getExpensesReview = async (props: IFormFilters): Promise<IFilterResponse<IExpense[]>> => {
  try {
    const { dateRange, ...rest } = props
    const to = dateRange?.to ? dayjs(dateRange.to).format('DD/MM/YYYY') : ''
    const from = dateRange?.from ? dayjs(dateRange.from).format('DD/MM/YYYY') : ''
    const { data } = await apiService.get('/expenses/review', {
      params: { ...rest, from, to }
    })

    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const getExpense = async ({ id }: { id: string }): Promise<IExpense> => {
  try {
    const { data } = await apiService.get(`/expenses/${id}`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const editExpense = async ({ id, ...props }: IExpenseRequest) => {
  try {
    const formData = valuesFormData(props)
    const { data } = await apiService.put(`/expenses/${id}/update`, formData)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const editExpenseStatus = async ({ id, ...props }: IExpenseRequest) => {
  try {
    const { data } = await apiService.put(`/expenses/${id}/status`, props)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const createExpense = async (props: IExpenseRequest) => {
  try {
    const formData = valuesFormData(props)
    const { data } = await apiService.post(`/expenses/create`, formData)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const deleteExpense = async ({ id }: { id: string }) => {
  try {
    const { data } = await apiService.delete(`/expenses//${id}/delete`)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const getOcrExpense = async (props: IExpenseRequest): Promise<any> => {
  try {
    const formData = valuesFormData(props)
    const { data } = await apiService.post(`/expenses/ocr`, formData)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}
