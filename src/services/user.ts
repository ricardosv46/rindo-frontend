import { IUser, IUserRequest } from '@interfaces/user'
import { apiService } from './axios/config'
import { utils, write } from 'xlsx'
import { downloadFile } from '@/lib/utils'

export const getUsers = async (): Promise<IUser[]> => {
  try {
    const { data } = await apiService.get('/users')
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const getApprovers = async (): Promise<IUser[]> => {
  try {
    const { data } = await apiService.get('/users')
    return data?.data?.filter((i: IUser) => i.role === 'APPROVER' || i.role === 'GLOBAL_APPROVER')
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const getGlobalApprovers = async (): Promise<IUser[]> => {
  try {
    const { data } = await apiService.get('/users/global-approvers')
    return data?.data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const createCorporation = async (props: IUserRequest) => {
  try {
    const { data } = await apiService.post(`/users/corporation/create`, props)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const createGlobalApprover = async (props: IUserRequest) => {
  try {
    const { data } = await apiService.post(`/users/global-approver/create`, props)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const createUser = async (props: IUserRequest) => {
  try {
    const { data } = await apiService.post(`/users/create`, props)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const createUserByExcel = async ({ file }: { file: File }) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await apiService.post('/users/create/excel', formData)
    if (data?.success) {
      return data
    }

    const worksheet = utils.json_to_sheet(data?.data)

    const workbook = utils.book_new()
    utils.book_append_sheet(workbook, worksheet, 'Usuarios Fallidos')

    const excelBuffer = write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    })

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    return { ...data, data: blob }
  } catch (error: any) {
    throw error?.response?.data?.message ?? error
  }
}

export const downloadTemplateUser = async () => {
  const { data } = await apiService.get('/users/download/template', {
    responseType: 'blob'
  })
  return new Blob([data])
}

export const updateUser = async ({ id, ...props }: IUserRequest) => {
  try {
    const { data } = await apiService.put(`/users/${id}/update`, props)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

export const deleteUser = async ({ id }: { id: string }) => {
  try {
    const { data } = await apiService.delete(`/users/${id}/delete`)
    return data
  } catch (error: any) {
    throw error?.response?.data?.message
  }
}

// export const confirmToken = async (token) => {
//   const { data } = await apiService.get(`/users/confirm/${token}`)
//   return data?.data
// }

// export const sendInvitationByEmpresa = async ({ email, name, lastname, role, areas }) => {
//   const { data } = await apiService.post('/users/empleado-invitation', { email, name, lastname, role, areas })
//   return data
// }

// export const registerEmpleado = async ({ email, name, lastname, phone, document, password, token }) => {
//   const { data } = await apiService.post('/users/create-empleado', { email, name, lastname, phone, document, password, token })
//   return data
// }

// export const forgotPassword = async ({ email }) => {
//   const { data } = await apiService.post('/auth/forgot-password', { email })
//   return data
// }

// export const validateToken = async (token) => {
//   const { data } = await apiService.get(`/auth/forgot-password/${token}`)
//   return data
// }

// export const newPassword = async ({ password, token }) => {
//   const { data } = await apiService.post(`/auth/forgot-password/${token}`, { password })
//   return data
// }

// export const newPasswordWithAuth = async ({ currentPassword, newPassword }) => {
//   const { data } = await apiService.post(`/auth/change-password`, { currentPassword, newPassword })
//   return data
// }

// export const updateUser = async (id, props) => {
//   const { data } = await apiService.put(`/users/${id}`, props)
//   return data
// }

// export const updateBusinessUser = async (props) => {
//   const { data } = await apiService.post(`/users/update-business`, props)
//   return data
// }

// export const confirmToken = async (token) => {
//   const { data } = await apiService.get(`/users/confirm/${token}`)
//   return data?.data
// }
