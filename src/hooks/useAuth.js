// Tracks Firebase auth state and exposes login/logout handlers
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { login, logout } from '../api/auth'

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogin = async (email, password) => {
    return await login(email, password)
  }

  const handleLogout = async () => {
    return await logout()
  }

  return { user, loading, handleLogin, handleLogout }
}
