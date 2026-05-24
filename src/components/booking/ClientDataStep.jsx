// Step 4: collects client name/email/phone, submits the full booking, shows confirmation screen
import { useState } from 'react'
import useBookings from '../../hooks/useBookings'

export default function ClientDataStep({ booking, onBack }) {
  const [client, setClient] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const { addBooking, loading } = useBookings()

  const validate = () => {
    const newErrors = {}
    if (!client.name.trim()) newErrors.name = 'Name is required'
    if (!client.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(client.email))
      newErrors.email = 'Invalid email'
    if (!client.phone.trim()) newErrors.phone = 'Phone is required'
    return newErrors
  }

  const handleSubmit = async () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const totalDuration = booking.services.reduce(
      (sum, s) => sum + s.duration,
      0,
    )

    const [h, m] = booking.time.split(':').map(Number)
    const endMin = h * 60 + m + totalDuration
    const endH = Math.floor(endMin / 60)
      .toString()
      .padStart(2, '0')
    const endM = (endMin % 60).toString().padStart(2, '0')
    const timeEnd = `${endH}:${endM}`

    const result = await addBooking({
      employeeId: booking.employee.id,
      services: booking.services.map((s) => {
        const empService = booking.employee.services.find(
          (es) => es.serviceId === s.id,
        )
        return {
          serviceId: s.id,
          duration: s.duration,
          price: empService ? empService.price : 0,
        }
      }),
      totalDuration,
      totalPrice: booking.services.reduce((sum, s) => {
        const empService = booking.employee.services.find(
          (es) => es.serviceId === s.id,
        )
        return sum + (empService ? empService.price : 0)
      }, 0),
      date: booking.date,
      timeStart: booking.time,
      timeEnd,
      clientName: client.name,
      clientEmail: client.email,
      clientPhone: client.phone,
    })

    if (result.success) setSuccess(true)
  }

  const updateField = (field, value) => {
    setClient((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: null }))
  }

  if (success) {
    return (
      <div className="flex flex-col items-center text-center py-10">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4">
          <span className="text-black text-2xl">✓</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500 text-sm mb-1">
          {booking.date} at {booking.time}
        </p>
        <p className="text-gray-500 text-sm mb-6">
          with {booking.employee.name}
        </p>
        <div className="card w-full text-left mb-6">
          {booking.services.map((s) => {
            const empService = booking.employee.services.find(
              (es) => es.serviceId === s.id,
            )
            return (
              <div
                key={s.id}
                className="flex justify-between text-sm py-2 border-b border-[#2a2a2a] last:border-0"
              >
                <span>{s.name}</span>
                <span>{empService ? empService.price : 0} Kč</span>
              </div>
            )
          })}
          <div className="flex justify-between font-medium mt-3">
            <span>Total</span>
            <span>
              {booking.services.reduce((sum, s) => {
                const empService = booking.employee.services.find(
                  (es) => es.serviceId === s.id,
                )
                return sum + (empService ? empService.price : 0)
              }, 0)}{' '}
              Kč
            </span>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Book Again
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Your Info</h2>
      <p className="text-gray-500 text-sm mb-6">Almost done!</p>

      <div className="card mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
          Summary
        </p>
        {booking.services.map((s) => (
          <div
            key={s.id}
            className="flex justify-between text-sm py-1.5 border-b border-[#2a2a2a] last:border-0"
          >
            <span>{s.name}</span>
            <span className="text-gray-400">{s.duration} min</span>
          </div>
        ))}
        <div className="flex justify-between text-sm mt-3">
          <span className="text-gray-400">Master</span>
          <span>{booking.employee.name}</span>
        </div>
        <div className="flex justify-between text-sm mt-1.5">
          <span className="text-gray-400">Date & Time</span>
          <span>
            {booking.date} at {booking.time}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={client.name}
            onChange={(e) => updateField('name', e.target.value)}
            className={`w-full bg-[#141414] border rounded-xl px-4 py-3 text-sm outline-none transition-colors
              ${errors.name ? 'border-red-500' : 'border-[#2a2a2a] focus:border-gray-500'}`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={client.email}
            onChange={(e) => updateField('email', e.target.value)}
            className={`w-full bg-[#141414] border rounded-xl px-4 py-3 text-sm outline-none transition-colors
              ${errors.email ? 'border-red-500' : 'border-[#2a2a2a] focus:border-gray-500'}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone"
            value={client.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className={`w-full bg-[#141414] border rounded-xl px-4 py-3 text-sm outline-none transition-colors
              ${errors.phone ? 'border-red-500' : 'border-[#2a2a2a] focus:border-gray-500'}`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onBack} className="btn-outline">
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  )
}
