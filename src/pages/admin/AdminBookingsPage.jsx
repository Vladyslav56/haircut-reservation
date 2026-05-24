// Admin page for managing bookings: date tabs, inline edit, create form
import { useEffect, useState } from 'react'
import useBookings from '../../hooks/useBookings'
import BookingCard from '../../components/admin/bookings/BookingCard'
import BookingCreateForm from '../../components/admin/bookings/BookingCreateForm'

export default function BookingsPage() {
  const {
    bookings,
    loading,
    getAllBookings,
    addBooking,
    editBooking,
    removeBooking,
  } = useBookings()
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  )
  const [editingId, setEditingId] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    getAllBookings()
  }, [])

  const dates = [...new Set(bookings.map((b) => b.date))].sort()
  const filtered = bookings.filter((b) => b.date === selectedDate)

  const handleSave = async (id, data) => {
    if (id) {
      await editBooking(id, data)
      setEditingId(null)
    } else {
      await addBooking(data)
      setShowCreateForm(false)
      await getAllBookings()
      setSelectedDate(data.date)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this booking?')) return
    await removeBooking(id)
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bookings</h2>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="text-sm border border-[#2a2a2a] rounded-xl px-4 py-2 hover:border-gray-500 transition-colors"
          >
            + Create booking
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <BookingCreateForm
            onSave={handleSave}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {dates.length === 0 && !showCreateForm && (
          <p className="text-gray-500 text-sm">No bookings yet</p>
        )}
        {dates.map((date) => {
          const d = new Date(date + 'T00:00:00')
          return (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center px-4 py-2 rounded-xl border transition-all min-w-17.5 ${
                selectedDate === date
                  ? 'border-white bg-white text-black'
                  : 'border-[#2a2a2a] bg-[#141414] text-white hover:border-gray-500'
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

      {filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No bookings for this date</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered
            .sort((a, b) => a.timeStart.localeCompare(b.timeStart))
            .map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isEditing={editingId === booking.id}
                onEdit={setEditingId}
                onSave={handleSave}
                onCancel={() => setEditingId(null)}
                onDelete={handleDelete}
              />
            ))}
        </div>
      )}
    </div>
  )
}
