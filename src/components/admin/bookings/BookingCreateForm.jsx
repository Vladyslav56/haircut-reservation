// Admin form for creating a new booking: employee → date → slots → services → client
import { useEffect, useState } from 'react'
import { useData } from '../../../context/DataContext'
import useBookings from '../../../hooks/useBookings'
import { generateSlots, getDayKey } from '../../../utils/slots'

const calcTimeEnd = (start, min) => {
  const [h, m] = start.split(':').map(Number)
  const total = h * 60 + m + min
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

const inputClass =
  'w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-500 transition-colors'

export default function BookingCreateForm({ onSave, onCancel }) {
  const { services, employees } = useData()
  const { getBookings } = useBookings()

  const [form, setForm] = useState({
    employeeId: '',
    date: '',
    timeStart: '',
    selectedServices: [],
    clientName: '',
    clientPhone: '',
    clientEmail: '',
  })
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [errors, setErrors] = useState({})

  const employee = employees.find((e) => e.id === form.employeeId)
  const totalDuration = form.selectedServices.reduce(
    (sum, s) => sum + s.duration,
    0,
  )

  useEffect(() => {
    setForm((p) => ({ ...p, timeStart: '' }))
    setSlots([])
    if (!employee || !form.date) return

    const dayKey = getDayKey(form.date)
    const schedule = employee.schedule?.[dayKey]
    if (!schedule) return

    setLoadingSlots(true)
    getBookings(employee.id, form.date).then((bookings) => {
      setSlots(
        generateSlots(
          schedule.start,
          schedule.end,
          totalDuration || 30,
          bookings,
        ),
      )
      setLoadingSlots(false)
    })
  }, [form.employeeId, form.date, totalDuration])

  const set = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }))
    setErrors((p) => ({ ...p, [field]: undefined }))
  }

  const isSelected = (serviceId) =>
    form.selectedServices.some((s) => s.serviceId === serviceId)

  const toggleService = (serviceId) => {
    if (isSelected(serviceId)) {
      setForm((p) => ({
        ...p,
        selectedServices: p.selectedServices.filter(
          (s) => s.serviceId !== serviceId,
        ),
      }))
    } else {
      const svc = services.find((s) => s.id === serviceId)
      const empSvc = employee?.services.find((s) => s.serviceId === serviceId)
      setForm((p) => ({
        ...p,
        selectedServices: [
          ...p.selectedServices,
          {
            serviceId,
            duration: svc?.duration ?? 0,
            price: empSvc?.price ?? 0,
          },
        ],
      }))
    }
  }

  const validate = () => {
    const e = {}
    if (!form.employeeId) e.employeeId = 'Required'
    if (!form.date) e.date = 'Required'
    if (!form.timeStart) e.timeStart = 'Select a time slot'
    if (form.selectedServices.length === 0)
      e.selectedServices = 'Select at least one service'
    if (!form.clientName.trim()) e.clientName = 'Required'
    return e
  }

  const handleSave = () => {
    const e = validate()
    if (Object.keys(e).length) return setErrors(e)

    const totalPrice = form.selectedServices.reduce(
      (sum, s) => sum + s.price,
      0,
    )
    onSave(null, {
      employeeId: form.employeeId,
      date: form.date,
      timeStart: form.timeStart,
      timeEnd: calcTimeEnd(form.timeStart, totalDuration),
      services: form.selectedServices,
      totalDuration,
      totalPrice,
      clientName: form.clientName.trim(),
      clientPhone: form.clientPhone.trim(),
      clientEmail: form.clientEmail.trim(),
    })
  }

  const dayKey = form.date ? getDayKey(form.date) : null
  const worksThisDay =
    employee && dayKey && employee.schedule?.[dayKey] !== null

  return (
    <div className="card space-y-4">
      <p className="text-sm font-medium">New Booking</p>

      {/* Employee */}
      <div>
        <p className="text-xs text-[#888] mb-2">Employee</p>
        <select
          value={form.employeeId}
          onChange={(e) => set('employeeId', e.target.value)}
          className={`${inputClass} bg-[#0a0a0a] ${errors.employeeId ? 'border-red-500' : ''}`}
        >
          <option value="">Select employee</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <p className="text-xs text-[#888] mb-2">Date</p>
        <input
          type="date"
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
          onClick={(e) => e.currentTarget.showPicker?.()}
          style={{ colorScheme: 'dark' }}
          className={`${inputClass} cursor-pointer ${errors.date ? 'border-red-500' : ''}`}
        />
        {employee && form.date && !worksThisDay && (
          <p className="text-yellow-500 text-xs mt-1">
            Employee doesn't work this day
          </p>
        )}
      </div>

      {/* Time slots */}
      {employee && form.date && worksThisDay && (
        <div>
          <p
            className={`text-xs mb-2 ${errors.timeStart ? 'text-red-500' : 'text-[#888]'}`}
          >
            Time
          </p>
          {loadingSlots ? (
            <p className="text-gray-500 text-sm">Loading slots…</p>
          ) : slots.length === 0 ? (
            <p className="text-gray-500 text-sm">No available slots</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => set('timeStart', time)}
                  className={`px-3 py-1.5 rounded-xl border text-sm transition-all ${
                    form.timeStart === time
                      ? 'border-white bg-white text-black'
                      : 'border-[#2a2a2a] bg-[#141414] hover:border-gray-500'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Services */}
      {employee && (
        <div>
          <p
            className={`text-xs mb-2 ${errors.selectedServices ? 'text-red-500' : 'text-[#888]'}`}
          >
            Services
          </p>
          <div className="space-y-2">
            {employee.services.map((empSvc) => {
              const svc = services.find((s) => s.id === empSvc.serviceId)
              if (!svc) return null
              const sel = isSelected(empSvc.serviceId)
              return (
                <div key={empSvc.serviceId} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleService(empSvc.serviceId)}
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${
                      sel
                        ? 'border-white bg-white'
                        : 'border-[#2a2a2a] bg-[#141414] hover:border-gray-500'
                    }`}
                  >
                    {sel && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="black"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                  <span className="text-sm flex-1">{svc.name}</span>
                  <span className="text-xs text-[#888]">{empSvc.price} Kč</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs text-[#888] mb-2">Client</p>
        <div className="space-y-2">
          <input
            value={form.clientName}
            onChange={(e) => set('clientName', e.target.value)}
            placeholder="Name"
            className={`${inputClass} ${errors.clientName ? 'border-red-500' : ''}`}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              value={form.clientPhone}
              onChange={(e) => set('clientPhone', e.target.value)}
              placeholder="Phone"
              className={inputClass}
            />
            <input
              value={form.clientEmail}
              onChange={(e) => set('clientEmail', e.target.value)}
              placeholder="Email"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} className="btn-primary">
          Create
        </button>
        <button onClick={onCancel} className="btn-outline">
          Cancel
        </button>
      </div>
    </div>
  )
}
