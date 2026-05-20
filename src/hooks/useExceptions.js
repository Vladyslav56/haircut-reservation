import { useEffect, useState } from 'react'
import { fetchExceptionsByEmployee } from '../services/exceptions'

export const useExceptions = () => {
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

  return { exceptions, loading, error, getExceptions }
}
