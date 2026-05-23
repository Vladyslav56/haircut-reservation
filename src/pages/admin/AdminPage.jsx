import { Outlet } from 'react-router-dom'
import AdminLogin from '../../components/admin/AdminLogin'
import AdminHeader from '../../components/admin/AdminHeader'
import useAuth from '../../hooks/useAuth'

export default function AdminPage() {
  const { user, loading, handleLogout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  if (!user) return <AdminLogin />

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <AdminHeader onLogout={handleLogout} />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  )
}
