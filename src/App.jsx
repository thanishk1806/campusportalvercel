import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import StudentDashboard from './pages/student/StudentDashboard'
import SubmitComplaint from './pages/student/SubmitComplaint'
import ComplaintDetail from './pages/ComplaintDetail'
import StaffDashboard from './pages/staff/StaffDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminComplaints from './pages/admin/AdminComplaints'
import AdminUsers from './pages/admin/AdminUsers'
import AdminCategories from './pages/admin/AdminCategories'
import StaffPerformance from './pages/admin/StaffPerformance'

function PrivateRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />
  return children
}

function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (user.role === 'ROLE_ADMIN') return <Navigate to="/admin" />
  if (user.role === 'ROLE_STAFF') return <Navigate to="/staff" />
  return <Navigate to="/student" />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/unauthorized" element={<div className="p-8 text-center text-red-600 text-xl">Unauthorized Access</div>} />

          {/* Student Routes */}
          <Route path="/student" element={
            <PrivateRoute roles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
              <StudentDashboard />
            </PrivateRoute>
          } />
          <Route path="/student/submit" element={
            <PrivateRoute roles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
              <SubmitComplaint />
            </PrivateRoute>
          } />

          {/* Staff Routes */}
          <Route path="/staff" element={
            <PrivateRoute roles={['ROLE_STAFF', 'ROLE_ADMIN']}>
              <StaffDashboard />
            </PrivateRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute roles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/complaints" element={
            <PrivateRoute roles={['ROLE_ADMIN']}>
              <AdminComplaints />
            </PrivateRoute>
          } />
          <Route path="/admin/users" element={
            <PrivateRoute roles={['ROLE_ADMIN']}>
              <AdminUsers />
            </PrivateRoute>
          } />
          <Route path="/admin/categories" element={
            <PrivateRoute roles={['ROLE_ADMIN']}>
              <AdminCategories />
            </PrivateRoute>
          } />
          <Route path="/admin/performance" element={
            <PrivateRoute roles={['ROLE_ADMIN']}>
              <StaffPerformance />
            </PrivateRoute>
          } />

          {/* Shared */}
          <Route path="/complaints/:id" element={
            <PrivateRoute roles={['ROLE_STUDENT', 'ROLE_STAFF', 'ROLE_ADMIN']}>
              <ComplaintDetail />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
