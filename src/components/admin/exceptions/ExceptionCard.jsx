// Display card for a day-off exception; swaps to ExceptionForm when isEditing
import { useData } from '../../../context/DataContext'
import ExceptionForm from './ExceptionForm'

export default function ExceptionCard({ exception, isEditing, onEdit, onSave, onCancel, onDelete }) {
  const { employees } = useData()

  if (isEditing) {
    return <ExceptionForm exception={exception} onSave={onSave} onCancel={onCancel} />
  }

  const employee = employees.find((e) => e.id === exception.employeeId)
  const d = new Date(exception.date + 'T00:00:00')
  const formattedDate = d.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium">{employee?.name ?? exception.employeeId}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a2a] text-gray-400">
              {formattedDate}
            </span>
          </div>
          <p className="text-sm text-[#888]">{exception.reason}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(exception.id)}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(exception.id)}
            className="text-xs text-red-500 hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
