import { Routes, Route, Navigate } from 'react-router-dom'
import BookingPage from './pages/BookingPage'
import AdminPage from './pages/admin/AdminPage'
import AdminEmployeesPage from './pages/admin/AdminEmployeesPage'
import AdminServicesPage from './pages/admin/AdminServicesPage'
import AdminBookingsPage from './pages/admin/AdminBookingsPage'
import AdminExceptionsPage from './pages/admin/AdminExceptionsPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<BookingPage />} />
      <Route path="/admin" element={<AdminPage />}>
        <Route index element={<Navigate replace to="/admin/bookings" />} />
        <Route path="employees" element={<AdminEmployeesPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="exceptions" element={<AdminExceptionsPage />} />
      </Route>
    </Routes>
  )
}
