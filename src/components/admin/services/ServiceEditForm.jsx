// Add/edit form for a service: name, category select, duration (minutes)
import { useState } from 'react'

const CATEGORIES = [
  { value: 'haircut', label: 'Haircuts' },
  { value: 'coloring', label: 'Coloring' },
  { value: 'styling', label: 'Styling' },
  { value: 'care', label: 'Care' },
]

const inputClass =
  'bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-500 transition-colors'

export default function ServiceEditForm({ service, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: service?.name ?? '',
    category: service?.category ?? 'haircut',
    duration: service?.duration ?? '',
  })
  const [errors, setErrors] = useState({})

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.duration || Number(form.duration) <= 0) e.duration = 'Must be > 0'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) return setErrors(e)
    onSave(service?.id ?? null, {
      name: form.name.trim(),
      category: form.category,
      duration: Number(form.duration),
    })
  }

  return (
    <div className="card">
      <p className="text-sm font-medium mb-3">
        {service ? 'Edit Service' : 'New Service'}
      </p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="col-span-2">
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Service name"
            className={`w-full ${inputClass} ${errors.name ? 'border-red-500' : ''}`}
          />
        </div>
        <select
          value={form.category}
          onChange={(e) => update('category', e.target.value)}
          className={`${inputClass} bg-[#0a0a0a]`}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <div>
          <input
            type="number"
            min="1"
            value={form.duration}
            onChange={(e) => update('duration', e.target.value)}
            placeholder="Duration (min)"
            className={`w-full ${inputClass} ${errors.duration ? 'border-red-500' : ''}`}
          />
        </div>
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
