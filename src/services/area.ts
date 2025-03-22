import { IArea, IAreaRequest } from '@interfaces/area'
import { apiService } from './axios/config'
import { IUserRequest } from '@interfaces/user'

export const getAreas = async (): Promise<IArea[]> => {
  try {
    const { data } = await apiService.get('/areas')
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const getArea = async ({ id }: { id: string }): Promise<IArea> => {
  try {
    const { data } = await apiService.get(`/areas/${id}`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const createArea = async (props: IAreaRequest) => {
  try {
    const { data } = await apiService.post(`/areas/create`, props)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const updateArea = async ({ id, ...props }: IAreaRequest) => {
  try {
    const { data } = await apiService.put(`/areas/${id}/update`, props)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const deleteArea = async ({ id }: { id: string }) => {
  try {
    const { data } = await apiService.delete(`/areas/${id}/delete`)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const addApprover = async ({ id, ...props }: { approver: string; id: string }) => {
  try {
    const { data } = await apiService.put(`/areas/approver/${id}/add`, props)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const deleteApprover = async ({ id, ...props }: { approver: string; id: string }) => {
  try {
    const { data } = await apiService.put(`/areas/approver/${id}/delete`, props)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}
