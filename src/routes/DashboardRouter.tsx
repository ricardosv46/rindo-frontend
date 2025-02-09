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
const PageEditExpensesSubmitter = lazy(() => import('@pages/dashboard/submitter/PageEditExpensesSubmitter'))
const PageDetailExpenseSubmitter = lazy(() => import('@pages/dashboard/submitter/PageDetailExpenseSubmitter'))
const PageExpensesSubmitter = lazy(() => import('@pages/dashboard/submitter/PageExpensesSubmitter'))
const PageReportsSubmitter = lazy(() => import('@pages/dashboard/submitter/PageReportsSubmitter'))
const PageCreateReportSubmitter = lazy(() => import('@pages/dashboard/submitter/PageCreateReportSubmitter'))
const PageEditReportSubmitter = lazy(() => import('@pages/dashboard/submitter/PageEditReportSubmitter'))

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
        {user?.role === 'SUBMITTER' && <Route path="expenses" element={<PageExpensesSubmitter />} />}
        {user?.role === 'SUBMITTER' && <Route path="create-expense" element={<PageCreateExpensesSubmitter />} />}
        {user?.role === 'SUBMITTER' && <Route path="edit-expense/:id" element={<PageEditExpensesSubmitter />} />}
        {user?.role === 'SUBMITTER' && <Route path="expense/:id" element={<PageDetailExpenseSubmitter />} />}
        {user?.role === 'SUBMITTER' && <Route path="reports" element={<PageReportsSubmitter />} />}
        {user?.role === 'SUBMITTER' && <Route path="create-report" element={<PageCreateReportSubmitter />} />}
        {user?.role === 'SUBMITTER' && <Route path="edit-report/:id" element={<PageEditReportSubmitter />} />}
        {/* GLOBAL_APPROVER */}
      </Routes>
    </Suspense>
  )
}
