import { AuthLayout, DashboardLayout } from '@components/layout'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import { PrivateRoute } from './PrivateRoute'
import { AuthRouter } from './AuthRouter'
import { DashboardRouter } from './DashboardRouter'
import { useAuth } from '@store/auth'
import { useEffect } from 'react'

export const RootRouter = () => {
  const { isAuth, refreshAuth } = useAuth()

  useEffect(() => {
    refreshAuth()
  }, [])

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="auth/*"
          element={
            <PublicRoute isAuth={isAuth}>
              <AuthLayout />
            </PublicRoute>
          }>
          <Route path="*" element={<AuthRouter />} />
        </Route>
        {/* Private Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute isAuth={isAuth}>
              <DashboardLayout />
            </PrivateRoute>
          }>
          <Route path="*" element={<DashboardRouter />} />
        </Route>
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/auth" />} /> {/* Redirect to auth */}
      </Routes>
    </Router>
  )
}
