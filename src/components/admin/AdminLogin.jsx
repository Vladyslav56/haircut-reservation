import { useState } from 'react'
import useAuth from '../../hooks/useAuth'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { handleLogin } = useAuth()

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    const result = await handleLogin(form.email, form.password)

    if (!result.success) {
      setError('Invalid email or password')
    }

    setLoading(false)
  }

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-full max-w-sm px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Admin Panel</h1>
          <p className="text-gray-500 text-sm">Sign in to continue</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-500 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-[#141414] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-500 transition-colors"
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
