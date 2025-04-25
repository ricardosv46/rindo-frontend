import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { Spinner } from '@components/shared'

const PageDashboard = lazy(() => import('@pages/dashboard/PageDashboard'))
const PageUsersAdmin = lazy(() => import('@pages/dashboard/users/PageUsersAdmin'))

const PageUsersCorporation = lazy(() => import('@pages/dashboard/users/PageUsersCorporation'))
const PageApprovers = lazy(() => import('@pages/dashboard/approvers/PageApprovers'))
const PageAreas = lazy(() => import('@pages/dashboard/areas/PageAreas'))
const PageCompanies = lazy(() => import('@pages/dashboard/companies/PageCompanies'))

const PageCreateExpenses = lazy(() => import('@pages/dashboard/expenses/PageCreateExpenses'))
const PageEditExpenses = lazy(() => import('@pages/dashboard/expenses/PageEditExpenses'))
const PageDetailExpense = lazy(() => import('@pages/dashboard/expenses/PageDetailExpense'))
const PageExpenses = lazy(() => import('@pages/dashboard/expenses/PageExpenses'))
const PageReports = lazy(() => import('@pages/dashboard/reports/PageReports'))
const PageCreateReport = lazy(() => import('@pages/dashboard/reports/PageCreateReport'))
const PageEditReport = lazy(() => import('@pages/dashboard/reports/PageEditReport'))
const PageDetailReport = lazy(() => import('@pages/dashboard/reports/PageDetailReport'))

export const DashboardRouter = () => {
  const { user } = useAuth()

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route element={<PageDashboard />} index />
        {/* ADMIN */}
        {user?.role === 'ADMIN' && <Route path="users" element={<PageUsersAdmin />} />}

        {/* CORPORATION */}
        {user?.role === 'CORPORATION' && <Route path="reports" element={<PageReports />} />}
        {user?.role === 'CORPORATION' && <Route path="report/:id" element={<PageDetailReport />} />}
        {user?.role === 'CORPORATION' && <Route path="expenses" element={<PageExpenses />} />}
        {user?.role === 'CORPORATION' && <Route path="expense/:id" element={<PageDetailExpense />} />}
        {user?.role === 'CORPORATION' && <Route path="users" element={<PageUsersCorporation />} />}
        {user?.role === 'CORPORATION' && <Route path="approvers" element={<PageApprovers />} />}
        {user?.role === 'CORPORATION' && <Route path="areas" element={<PageAreas />} />}
        {user?.role === 'CORPORATION' && <Route path="companies" element={<PageCompanies />} />}

        {/* SUBMITTER */}
        {user?.role === 'SUBMITTER' && <Route path="expenses" element={<PageExpenses />} />}
        {user?.role === 'SUBMITTER' && <Route path="create-expense" element={<PageCreateExpenses />} />}
        {user?.role === 'SUBMITTER' && <Route path="edit-expense/:id" element={<PageEditExpenses />} />}
        {user?.role === 'SUBMITTER' && <Route path="review-expense/:id" element={<PageEditExpenses />} />}
        {user?.role === 'SUBMITTER' && <Route path="expense/:id" element={<PageDetailExpense />} />}
        {user?.role === 'SUBMITTER' && <Route path="reports" element={<PageReports />} />}
        {user?.role === 'SUBMITTER' && <Route path="create-report" element={<PageCreateReport />} />}
        {user?.role === 'SUBMITTER' && <Route path="edit-report/:id" element={<PageEditReport />} />}
        {user?.role === 'SUBMITTER' && <Route path="report/:id" element={<PageDetailReport />} />}
        {user?.role === 'SUBMITTER' && <Route path="review" element={<PageExpenses />} />}

        {/* APPROVER */}
        {user?.role === 'APPROVER' && <Route path="to-review" element={<PageReports />} />}
        {user?.role === 'APPROVER' && <Route path="reviewed" element={<PageReports />} />}
        {user?.role === 'APPROVER' && <Route path="report/:id" element={<PageDetailReport />} />}

        {/* GLOBAL_APPROVER */}
        {user?.role === 'GLOBAL_APPROVER' && <Route path="to-review" element={<PageReports />} />}
        {user?.role === 'GLOBAL_APPROVER' && <Route path="reviewed" element={<PageReports />} />}
        {user?.role === 'GLOBAL_APPROVER' && <Route path="report/:id" element={<PageDetailReport />} />}
      </Routes>
    </Suspense>
  )
}
