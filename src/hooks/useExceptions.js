// Exceptions (days off) state with per-employee fetch, all-fetch, and admin CRUD
import { useState } from 'react'
import {
  fetchExceptionsByEmployee,
  fetchAllExceptions,
  addException as apiAdd,
  updateException,
  deleteException,
} from '../api/exeptions'

export default function useExceptions() {
  const [exceptions, setExceptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getExceptions = async (employeeId) => {
    setLoading(true)
    try {
      const data = await fetchExceptionsByEmployee(employeeId)
      setExceptions(data)
      return data
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const getAllExceptions = async () => {
    setLoading(true)
    try {
      const data = await fetchAllExceptions()
      setExceptions(data)
      return data
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const addException = async (data) => {
    try {
      const ref = await apiAdd(data)
      setExceptions((prev) => [...prev, { id: ref.id, ...data }])
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const editException = async (id, data) => {
    try {
      await updateException(id, data)
      setExceptions((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const removeException = async (id) => {
    try {
      await deleteException(id)
      setExceptions((prev) => prev.filter((e) => e.id !== id))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  return {
    exceptions,
    loading,
    error,
    getExceptions,
    getAllExceptions,
    addException,
    editException,
    removeException,
  }
}
