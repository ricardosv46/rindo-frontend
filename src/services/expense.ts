import { IArea, IAreaRequest } from '@interfaces/area'
import { apiService } from './axios/config'
import { IExpenseRequest } from '@interfaces/expense'
import { valuesFormData } from '@lib/utils'

export const getExpenses = async (): Promise<IArea[]> => {
  try {
    const { data } = await apiService.get('/expenses')
    return data?.data
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
