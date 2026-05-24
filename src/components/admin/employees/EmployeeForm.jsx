// Add/edit form for an employee: basic info, weekly schedule, services with prices
import { useState } from 'react'
import ScheduleEditor from './ScheduleEditor'
import ServicesEditor from './ServicesEditor'

const DEFAULT_SCHEDULE = {
  mon: { start: '10:00', end: '18:00' },
  tue: { start: '10:00', end: '18:00' },
  wed: { start: '10:00', end: '18:00' },
  thu: { start: '10:00', end: '18:00' },
  fri: { start: '10:00', end: '18:00' },
  sat: null,
  sun: null,
}

const inputClass =
  'w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-500 transition-colors'

export default function EmployeeForm({ employee, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: employee?.name ?? '',
    level: employee?.level ?? '',
    photo: employee?.photo ?? '',
    schedule: employee?.schedule ?? DEFAULT_SCHEDULE,
    services: employee?.services ?? [],
  })
  const [errors, setErrors] = useState({})

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.level.trim()) e.level = 'Required'
    if (form.services.length === 0) e.services = 'Select at least one service'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) return setErrors(e)
    onSave(employee?.id ?? null, {
      name: form.name.trim(),
      level: form.level.trim(),
      photo: form.photo.trim(),
      schedule: form.schedule,
      services: form.services,
    })
  }

  return (
    <div className="card space-y-6">
      <p className="text-sm font-medium">
        {employee ? 'Edit Employee' : 'New Employee'}
      </p>

      {/* Basic info */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-[#888]">Basic info</p>
        <input
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Name"
          className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`}
        />
        <input
          value={form.level}
          onChange={(e) => update('level', e.target.value)}
          placeholder="Level (e.g. Junior, Senior)"
          className={`${inputClass} ${errors.level ? 'border-red-500' : ''}`}
        />
        <input
          value={form.photo}
          onChange={(e) => update('photo', e.target.value)}
          placeholder="Photo URL (optional)"
          className={inputClass}
        />
      </div>

      <div className="border-t border-[#2a2a2a]" />

      {/* Schedule */}
      <div>
        <p className="text-xs font-medium text-[#888] mb-3">Schedule</p>
        <ScheduleEditor
          schedule={form.schedule}
          onChange={(s) => update('schedule', s)}
        />
      </div>

      <div className="border-t border-[#2a2a2a]" />

      {/* Services */}
      <div>
        <p className="text-xs font-medium text-[#888] mb-3">Services & prices</p>
        {errors.services && (
          <p className="text-red-500 text-xs mb-2">{errors.services}</p>
        )}
        <ServicesEditor
          selectedServices={form.services}
          onChange={(s) => update('services', s)}
        />
      </div>

      <div className="flex gap-2 pt-2">
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
