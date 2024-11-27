import { Spinner } from '@components/shared'
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

const PageForgotPassword = lazy(() => import('@pages/auth/PageForgotPassword/PageForgotPassword'))
const PageLogin = lazy(() => import('@pages/auth/PageLogin/PageLogin'))
const PageRegister = lazy(() => import('@pages/auth/PageRegister/PageRegister'))
const PageResetPassword = lazy(() => import('@pages/auth/PageResetPassword/PageResetPassword'))

export const AuthRouter = () => {
  return (
    <Suspense fallback={<Spinner full />}>
      <Routes>
        <Route path="/login" element={<PageLogin />} />
        <Route path="/register" element={<PageRegister />} />
        <Route path="/forgot-password" element={<PageForgotPassword />} />
        <Route path="/reset-password" element={<PageResetPassword />} />
      </Routes>
    </Suspense>
  )
}
