import BookingCard from './BookingCard'
import BookingEditForm from './BookingEditForm'

export default function BookingsList({
  bookings,
  editingId,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}) {
  if (bookings.length === 0) {
    return <p className="text-gray-500 text-sm">No bookings for this date</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {bookings
        .sort((a, b) => a.timeStart.localeCompare(b.timeStart))
        .map((booking) =>
          editingId === booking.id ? (
            <BookingEditForm
              key={booking.id}
              booking={booking}
              onSave={onSave}
              onCancel={onCancel}
            />
          ) : (
            <BookingCard
              key={booking.id}
              booking={booking}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ),
        )}
    </div>
  )
}
