// Display card for an employee; swaps to EmployeeForm when isEditing
import EmployeeForm from './EmployeeForm'

const DAY_LABELS = {
  mon: 'Mon',
  tue: 'Tue',
  wed: 'Wed',
  thu: 'Thu',
  fri: 'Fri',
  sat: 'Sat',
  sun: 'Sun',
}

function workingDays(schedule) {
  return Object.entries(schedule || {})
    .filter(([, v]) => v !== null)
    .map(([k]) => DAY_LABELS[k])
    .join(' · ')
}

export default function EmployeeCard({
  employee,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}) {
  if (isEditing) {
    return (
      <EmployeeForm employee={employee} onSave={onSave} onCancel={onCancel} />
    )
  }

  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {employee.photo ? (
            <img
              src={employee.photo}
              alt={employee.name}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center shrink-0">
              <span className="text-sm text-[#888]">
                {employee.name?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{employee.name}</p>
              {employee.level && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a2a] text-gray-400">
                  {employee.level}
                </span>
              )}
            </div>
            <p className="text-xs text-[#888] mt-0.5">
              {workingDays(employee.schedule) || 'No schedule'}
            </p>
            <p className="text-xs text-[#888]">
              {employee.services?.length ?? 0} services
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(employee.id)}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(employee.id)}
            className="text-xs text-red-500 hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
