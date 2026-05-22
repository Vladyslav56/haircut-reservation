import { useState } from 'react'
import useBookings from '../../hooks/useBookings'
import {
  generateSlots,
  getDayKey,
  isEmployeeWorkingDay,
  formatDate,
} from '../../utils/slots'

export default function DateTimeStep({
  employee,
  selectedServices,
  selected,
  onSelect,
  onNext,
  onBack,
}) {
  const [selectedDate, setSelectedDate] = useState(selected.date || null)
  const [slots, setSlots] = useState([])
  const [selectedTime, setSelectedTime] = useState(selected.time || null)
  const [loadingSlots, setLoadingSlots] = useState(false)

  const { getBookings } = useBookings()

  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0)

  const availableDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return date.toISOString().split('T')[0]
  }).filter((date) => isEmployeeWorkingDay(employee, date))

  const handleDateSelect = async (date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setSlots([])
    setLoadingSlots(true)

    try {
      const bookings = await getBookings(employee.id, date)
      const dayKey = getDayKey(date)
      const { start, end } = employee.schedule[dayKey]
      const available = generateSlots(start, end, totalDuration, bookings)
      setSlots(available)
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    onSelect(selectedDate, time)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Select Date & Time</h2>
      <p className="text-gray-500 text-sm mb-6">
        Total duration: {totalDuration} min
      </p>

      <div className="mb-6">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
          Date
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
          {availableDates.map((date) => {
            const isSelected = selectedDate === date
            const d = new Date(date)
            return (
              <button
                key={date}
                onClick={() => handleDateSelect(date)}
                className={`flex flex-col items-center p-3 rounded-xl border transition-all
                  ${
                    isSelected
                      ? 'border-white bg-white text-black'
                      : 'border-[#2a2a2a] bg-[#141414] hover:border-gray-500'
                  }`}
              >
                <span className="text-xs text-gray-500">
                  {d.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="font-medium text-sm">
                  {d.toLocaleDateString('en-US', { day: 'numeric' })}
                </span>
                <span className="text-xs text-gray-500">
                  {d.toLocaleDateString('en-US', { month: 'short' })}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            Time
          </h3>

          {loadingSlots && (
            <p className="text-gray-500 text-sm">Loading slots...</p>
          )}

          {!loadingSlots && slots.length === 0 && (
            <p className="text-gray-500 text-sm">
              No available slots for this day
            </p>
          )}

          {!loadingSlots && slots.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-2">
              {slots.map((time) => {
                const isSelected = selectedTime === time
                return (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`p-2.5 rounded-xl border text-sm font-medium transition-all
                      ${
                        isSelected
                          ? 'border-white bg-white text-black'
                          : 'border-[#2a2a2a] bg-[#141414] hover:border-gray-500'
                      }`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <button onClick={onBack} className="btn-outline">
          Back
        </button>
        {selectedDate && selectedTime && (
          <button onClick={onNext} className="btn-primary">
            Continue
          </button>
        )}
      </div>
    </div>
  )
}
