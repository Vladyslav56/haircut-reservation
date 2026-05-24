// Employees state with auto-fetch on mount and admin CRUD methods
import { useEffect, useState } from 'react'
import {
  fetchEmployees,
  addEmployee as apiAdd,
  updateEmployee,
  deleteEmployee,
} from '../api/employees'

export default function useEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEmployees()
      .then((data) => setEmployees(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addEmployee = async (data) => {
    try {
      const ref = await apiAdd(data)
      setEmployees((prev) => [...prev, { id: ref.id, ...data }])
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const editEmployee = async (id, data) => {
    try {
      await updateEmployee(id, data)
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const removeEmployee = async (id) => {
    try {
      await deleteEmployee(id)
      setEmployees((prev) => prev.filter((e) => e.id !== id))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  return { employees, loading, error, addEmployee, editEmployee, removeEmployee }
}
