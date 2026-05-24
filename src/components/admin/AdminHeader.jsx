// Admin top navigation bar with section links and sign-out button
import { NavLink } from 'react-router-dom'

export default function AdminHeader({ onLogout }) {
  const links = [
    { to: '/admin/bookings', label: 'Bookings' },
    { to: '/admin/services', label: 'Services' },
    { to: '/admin/employees', label: 'Employees' },
    { to: '/admin/exceptions', label: 'Exceptions' },
  ]

  return (
    <header className="bg-[#141414] border-b border-[#2a2a2a] sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black text-sm">✂️</span>
          </div>
          <h1 className="font-bold">Premium Haircut Admin</h1>
        </div>
        <button
          onClick={onLogout}
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          Sign Out
        </button>
      </div>
      <nav className="max-w-5xl mx-auto px-4 pb-3 flex gap-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm transition-colors
              ${
                isActive
                  ? 'bg-white text-black font-medium'
                  : 'text-gray-500 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
