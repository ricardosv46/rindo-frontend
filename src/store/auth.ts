import { IUser } from '@interfaces/user'
import { getDetail } from '@services/auth'
import { create } from 'zustand'

interface AuthStore {
  isAuth: boolean
  user: IUser | null
  isLoading: boolean
  logoutAction: () => void
  loginAction: (token: string, user: IUser) => void
  refreshAuth: () => void
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isAuth: false,
  isLoading: true,
  logoutAction: () => {
    localStorage.clear()
    set({ isAuth: false, user: null })
  },
  loginAction: (token: string, user: IUser) => {
    localStorage.setItem('token', token)
    set({ isAuth: true, user })
  },
  refreshAuth: async () => {
    try {
      set({ isLoading: true })

      const data = await getDetail()
      set({ isAuth: true, isLoading: false, user: data })
    } catch (error) {
      set({ isAuth: false, user: null, isLoading: false })
    }
  }
}))
