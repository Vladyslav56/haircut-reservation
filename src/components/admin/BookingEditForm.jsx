import { useState } from 'react'

export default function BookingEditForm({ booking, onSave, onCancel }) {
  const [form, setForm] = useState({
    clientName: booking.clientName,
    clientEmail: booking.clientEmail,
    clientPhone: booking.clientPhone,
    timeStart: booking.timeStart,
  })

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <div className="card">
      <p className="text-sm font-medium mb-3">Edit Booking</p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input
          value={form.clientName}
          onChange={(e) => update('clientName', e.target.value)}
          placeholder="Name"
          className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-500 transition-colors"
        />
        <input
          value={form.clientPhone}
          onChange={(e) => update('clientPhone', e.target.value)}
          placeholder="Phone"
          className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-500 transition-colors"
        />
        <input
          value={form.clientEmail}
          onChange={(e) => update('clientEmail', e.target.value)}
          placeholder="Email"
          className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-500 transition-colors"
        />
        <input
          value={form.timeStart}
          onChange={(e) => update('timeStart', e.target.value)}
          placeholder="Time (10:00)"
          className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-500 transition-colors"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(booking.id, form)}
          className="btn-primary"
        >
          Save
        </button>
        <button onClick={onCancel} className="btn-outline">
          Cancel
        </button>
      </div>
    </div>
  )
}
