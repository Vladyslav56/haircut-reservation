// Add/edit form for a day-off exception: employee select, date picker, reason
import { useState } from 'react'
import { useData } from '../../../context/DataContext'

const inputClass =
  'w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-500 transition-colors'

export default function ExceptionForm({ exception, onSave, onCancel }) {
  const { employees } = useData()
  const [form, setForm] = useState({
    employeeId: exception?.employeeId ?? '',
    date: exception?.date ?? '',
    reason: exception?.reason ?? '',
  })
  const [errors, setErrors] = useState({})

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!form.employeeId) e.employeeId = 'Required'
    if (!form.date) e.date = 'Required'
    if (!form.reason.trim()) e.reason = 'Required'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) return setErrors(e)
    onSave(exception?.id ?? null, {
      employeeId: form.employeeId,
      date: form.date,
      reason: form.reason.trim(),
    })
  }

  return (
    <div className="card">
      <p className="text-sm font-medium mb-3">
        {exception ? 'Edit Day Off' : 'New Day Off'}
      </p>
      <div className="space-y-3 mb-3">
        <select
          value={form.employeeId}
          onChange={(e) => update('employeeId', e.target.value)}
          className={`${inputClass} bg-[#0a0a0a] ${errors.employeeId ? 'border-red-500' : ''}`}
        >
          <option value="">Select employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.date}
          onChange={(e) => update('date', e.target.value)}
          onClick={(e) => e.currentTarget.showPicker?.()}
          style={{ colorScheme: 'dark' }}
          className={`${inputClass} cursor-pointer ${errors.date ? 'border-red-500' : ''}`}
        />
        <input
          value={form.reason}
          onChange={(e) => update('reason', e.target.value)}
          placeholder="Reason (e.g. Vacation, Sick leave)"
          className={`${inputClass} ${errors.reason ? 'border-red-500' : ''}`}
        />
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} className="btn-primary">
          Save
        </button>
        <button onClick={onCancel} className="btn-outline">
          Cancel
        </button>
      </div>
    </div>
  )
}
