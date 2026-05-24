// Inline edit form for an existing booking: time slots, services, client fields
import { useEffect, useState } from 'react'
import { useData } from '../../../context/DataContext'
import useBookings from '../../../hooks/useBookings'
import { generateSlots, getDayKey } from '../../../utils/slots'

// Adds duration (minutes) to a "HH:MM" start time and returns the result
const calcTimeEnd = (start, min) => {
  const [h, m] = start.split(':').map(Number)
  const total = h * 60 + m + min
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

const inputClass =
  'bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm outline-none focus:border-gray-500 transition-colors'

const Checkmark = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
    <path
      d="M1 4L3.5 6.5L9 1"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function BookingEditForm({ booking, onSave, onCancel }) {
  const { services, employees } = useData()
  const { getBookings } = useBookings()

  const employee = employees.find((e) => e.id === booking.employeeId)

  const [form, setForm] = useState({
    timeStart: booking.timeStart,
    clientName: booking.clientName,
    clientEmail: booking.clientEmail,
    clientPhone: booking.clientPhone,
    services: booking.services,
  })
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const totalDuration = form.services.reduce((sum, s) => sum + s.duration, 0)

  // Reload available slots when total duration changes (service toggle)
  useEffect(() => {
    if (!employee) return
    const dayKey = getDayKey(booking.date)
    const schedule = employee.schedule?.[dayKey]
    if (!schedule) {
      setSlots([])
      return
    }

    setLoadingSlots(true)
    getBookings(booking.employeeId, booking.date).then((all) => {
      // Exclude the current booking so its own slot shows as free
      const others = all.filter((b) => b.id !== booking.id)
      setSlots(
        generateSlots(
          schedule.start,
          schedule.end,
          totalDuration || 30,
          others,
        ),
      )
      setLoadingSlots(false)
    })
  }, [totalDuration])

  const isSelected = (serviceId) =>
    form.services.some((s) => s.serviceId === serviceId)

  const toggleService = (serviceId) => {
    if (isSelected(serviceId)) {
      setForm((p) => ({
        ...p,
        services: p.services.filter((s) => s.serviceId !== serviceId),
      }))
    } else {
      const svc = services.find((s) => s.id === serviceId)
      const empSvc = employee?.services.find((s) => s.serviceId === serviceId)
      setForm((p) => ({
        ...p,
        services: [
          ...p.services,
          {
            serviceId,
            duration: svc?.duration ?? 0,
            price: empSvc?.price ?? 0,
          },
        ],
      }))
    }
  }

  const handleCancel = () => {
    // Reset to original booking values before closing
    setForm({
      timeStart: booking.timeStart,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone,
      services: booking.services,
    })
    onCancel()
  }

  const handleSave = () => {
    const totalPrice = form.services.reduce((sum, s) => sum + s.price, 0)
    onSave(booking.id, {
      ...form,
      totalDuration,
      totalPrice,
      timeEnd: calcTimeEnd(form.timeStart, totalDuration),
    })
  }

  return (
    <div className="card space-y-4">
      <p className="text-sm font-medium">Edit Booking</p>

      {/* Available time slots for this employee/date */}
      <div>
        <p className="text-xs text-[#888] mb-2">Time</p>
        {loadingSlots ? (
          <p className="text-gray-500 text-sm">Loading slots…</p>
        ) : slots.length === 0 ? (
          <p className="text-gray-500 text-sm">No available slots</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {slots.map((time) => (
              <button
                key={time}
                onClick={() => setForm((p) => ({ ...p, timeStart: time }))}
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

      {/* Service checkboxes — prices from employee's rate card */}
      <div>
        <p className="text-xs text-[#888] mb-2">Services</p>
        <div className="space-y-2">
          {employee?.services.map((empSvc) => {
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
                  {sel && <Checkmark />}
                </button>
                <span className="text-sm flex-1">{svc.name}</span>
                <span className="text-xs text-[#888]">{empSvc.price} Kč</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Client contact info */}
      <div>
        <p className="text-xs text-[#888] mb-2">Client</p>
        <div className="grid grid-cols-2 gap-2">
          <input
            value={form.clientName}
            onChange={(e) =>
              setForm((p) => ({ ...p, clientName: e.target.value }))
            }
            placeholder="Name"
            className={inputClass}
          />
          <input
            value={form.clientPhone}
            onChange={(e) =>
              setForm((p) => ({ ...p, clientPhone: e.target.value }))
            }
            placeholder="Phone"
            className={inputClass}
          />
          <input
            value={form.clientEmail}
            onChange={(e) =>
              setForm((p) => ({ ...p, clientEmail: e.target.value }))
            }
            placeholder="Email"
            className={`${inputClass} col-span-2`}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} className="btn-primary">
          Save
        </button>
        <button onClick={handleCancel} className="btn-outline">
          Cancel
        </button>
      </div>
    </div>
  )
}
