import { Spinner } from '@components/shared'
import { useAuth } from '@store/auth'
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface Props {
  isAuth: boolean
  children: ReactNode
}

export const PrivateRoute = ({ isAuth, children }: Props) => {
  const { isLoading } = useAuth()

  if (isLoading) return <Spinner full />

  return isAuth ? children : <Navigate to="/auth/login" />
}
