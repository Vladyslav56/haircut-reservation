import { useEffect, useState } from 'react'
import { fetchEmployees } from '../api/employees'

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

  return { employees, loading, error }
}
