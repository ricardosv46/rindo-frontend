import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { Spinner } from '@components/shared'

const PageDashboard = lazy(() => import('@pages/dashboard/PageDashboard'))
const PageUsersAdmin = lazy(() => import('@pages/dashboard/admin/PageUsersAdmin'))

const PageUsersCorporation = lazy(() => import('@pages/dashboard/corporation/PageUsersCorporation'))
const PageExpensesCorporation = lazy(() => import('@pages/dashboard/corporation/PageExpensesCorporation'))
const PageReportsCorporation = lazy(() => import('@pages/dashboard/corporation/PageReportsCorporation'))
const PageApproversCorporation = lazy(() => import('@pages/dashboard/corporation/PageApproversCorporation'))
const PageAreasCorporation = lazy(() => import('@pages/dashboard/corporation/PageAreasCorporation'))
const PageCompaniesCorporation = lazy(() => import('@pages/dashboard/corporation/PageCompaniesCorporation'))
const PageCreateExpensesSubmitter = lazy(() => import('@pages/dashboard/submitter/PageCreateExpensesSubmitter'))

export const DashboardRouter = () => {
  const { user } = useAuth()

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route element={<PageDashboard />} index />
        {/* ADMIN */}
        {user?.role === 'ADMIN' && <Route path="users" element={<PageUsersAdmin />} />}

        {/* CORPORATION */}
        {user?.role === 'CORPORATION' && <Route path="reports" element={<PageReportsCorporation />} />}
        {user?.role === 'CORPORATION' && <Route path="expenses" element={<PageExpensesCorporation />} />}
        {user?.role === 'CORPORATION' && <Route path="users" element={<PageUsersCorporation />} />}
        {user?.role === 'CORPORATION' && <Route path="approvers" element={<PageApproversCorporation />} />}
        {user?.role === 'CORPORATION' && <Route path="areas" element={<PageAreasCorporation />} />}
        {user?.role === 'CORPORATION' && <Route path="companies" element={<PageCompaniesCorporation />} />}

        {/* APPROVER */}

        {/* SUBMITTER */}
        {user?.role === 'SUBMITTER' && <Route path="expenses" element={<PageCreateExpensesSubmitter />} />}
        {user?.role === 'SUBMITTER' && <Route path="create-expense" element={<PageCreateExpensesSubmitter />} />}

        {/* GLOBAL_APPROVER */}
      </Routes>
    </Suspense>
  )
}
