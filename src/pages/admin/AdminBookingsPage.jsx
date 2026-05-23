import { useEffect, useState } from 'react'
import useBookings from '../../hooks/useBookings'
import BookingsList from '../../components/admin/BookingsList'

export default function BookingsPage() {
  const { bookings, loading, getAllBookings, editBooking, removeBooking } =
    useBookings()
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    getAllBookings()
  }, [])

  const dates = [...new Set(bookings.map((b) => b.date))].sort()
  const filtered = bookings.filter((b) => b.date === selectedDate)

  const handleEdit = (booking) => setEditingId(booking.id)

  const handleSave = async (id, form) => {
    await editBooking(id, form)
    setEditingId(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this booking?')) return
    await removeBooking(id)
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bookings</h2>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {dates.length === 0 && (
          <p className="text-gray-500 text-sm">No bookings yet</p>
        )}
        {dates.map((date) => {
          const d = new Date(date)
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center px-4 py-2 rounded-xl border transition-all min-w-[70px]
                ${
                  selectedDate === date
                    ? 'border-white bg-white text-black'
                    : 'border-[#2a2a2a] bg-[#141414] text-white hover:border-gray-500'
                }`}
            >
              <span
                className={`text-xs ${selectedDate === date ? 'text-gray-500' : 'text-gray-500'}`}
              >
                {d.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="font-medium text-sm">
                {d.toLocaleDateString('en-US', { day: 'numeric' })}
              </span>
              <span
                className={`text-xs ${selectedDate === date ? 'text-gray-500' : 'text-gray-500'}`}
              >
                {d.toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </button>
          )
        })}
      </div>

      <BookingsList
        bookings={filtered}
        editingId={editingId}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={() => setEditingId(null)}
        onDelete={handleDelete}
      />
    </div>
  )
}
