// Services state with auto-fetch on mount and admin CRUD methods
import { useEffect, useState } from 'react'
import {
  fetchServices,
  addService as apiAdd,
  updateService,
  deleteService,
} from '../api/services'

export default function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchServices()
      .then((data) => setServices(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addService = async (data) => {
    try {
      const ref = await apiAdd(data)
      setServices((prev) => [...prev, { id: ref.id, ...data }])
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const editService = async (id, data) => {
    try {
      await updateService(id, data)
      setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const removeService = async (id) => {
    try {
      await deleteService(id)
      setServices((prev) => prev.filter((s) => s.id !== id))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  return { services, loading, error, addService, editService, removeService }
}
