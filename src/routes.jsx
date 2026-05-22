import { Routes, Route } from 'react-router-dom'
import BookingPage from './pages/BookingPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<BookingPage />} />
      {/* <Route path="/admin" element={<AdminPanel />}>
        <Route index element={<BookingPage />} />
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="services" element={<ServiceManagement />} />
        <Route path="bookings" element={<BookingsManagement />} />
        <Route path="exceptions" element={<ExceptionsManagement />} />
      </Route> */}
    </Routes>
  )
}
