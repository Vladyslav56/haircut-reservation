import { createContext, useContext } from 'react'
import useServices from '../hooks/useServices'
import useEmployees from '../hooks/useEmployees'

const DataContext = createContext(null)

export default function DataProvider({ children }) {
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useServices()
  const {
    employees,
    loading: employeesLoading,
    error: employeesError,
  } = useEmployees()

  const loading = servicesLoading || employeesLoading
  const error = servicesError || employeesError

  return (
    <DataContext.Provider value={{ services, employees, loading, error }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}
