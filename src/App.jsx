import { useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { useEmployees } from './hooks/useEmployees'
import { useServices } from './hooks/useServices'

function App() {
  const {
    employees,
    loading: employeesLoading,
    error: employeesError,
  } = useEmployees()
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useServices()

  if (employeesLoading || servicesLoading) {
    return <div>Loading...</div>
  }

  console.log('Employees:', employees)
  console.log('Services:', services)

  return (
    <div>
      <p>Employees: {employees.length}</p>
      <p>Services: {services.length}</p>
    </div>
  )
}

export default App
