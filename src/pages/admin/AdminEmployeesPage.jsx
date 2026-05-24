// Admin page for managing employees: list, add form, inline edit/delete
import { useState } from 'react'
import useEmployees from '../../hooks/useEmployees'
import EmployeeCard from '../../components/admin/employees/EmployeeCard'
import EmployeeForm from '../../components/admin/employees/EmployeeForm'

export default function AdminEmployeesPage() {
  const { employees, loading, addEmployee, editEmployee, removeEmployee } = useEmployees()
  const [editingId, setEditingId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const handleSave = async (id, data) => {
    if (id) {
      await editEmployee(id, data)
      setEditingId(null)
    } else {
      await addEmployee(data)
      setShowAddForm(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return
    await removeEmployee(id)
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Employees</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="text-sm border border-[#2a2a2a] rounded-xl px-4 py-2 hover:border-gray-500 transition-colors"
          >
            + Add employee
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6">
          <EmployeeForm
            employee={null}
            onSave={handleSave}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {employees.length === 0 && !showAddForm ? (
        <p className="text-gray-500 text-sm">No employees yet</p>
      ) : (
        <div className="space-y-3">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              isEditing={editingId === employee.id}
              onEdit={setEditingId}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
