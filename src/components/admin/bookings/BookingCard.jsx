// Display card for a single booking; swaps to BookingEditForm when isEditing
import { useData } from '../../../context/DataContext'
import BookingEditForm from './BookingEditForm'

export default function BookingCard({
  booking,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}) {
  const { services, employees } = useData()
  const employee = employees.find((e) => e.id === booking.employeeId)

  if (isEditing) {
    return (
      <BookingEditForm booking={booking} onSave={onSave} onCancel={onCancel} />
    )
  }

  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div>
          {/* Time range + employee badge */}
          <div className="flex items-center gap-3 mb-2">
            <span className="font-medium">{booking.timeStart}</span>
            <span className="text-gray-500 text-sm">→</span>
            <span className="text-gray-500 text-sm">{booking.timeEnd}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a2a] text-gray-400">
              {employee?.name ?? booking.employeeId}
            </span>
          </div>

          {/* Client info */}
          <p className="font-medium">{booking.clientName}</p>
          <p className="text-gray-500 text-sm">{booking.clientPhone}</p>
          <p className="text-gray-500 text-sm">{booking.clientEmail}</p>

          {/* Service name pills + total price */}
          <div className="flex flex-wrap gap-1 mt-2">
            {booking.services.map((s) => (
              <span
                key={s.serviceId}
                className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a2a] text-gray-400"
              >
                {services.find((sv) => sv.id === s.serviceId)?.name ??
                  s.serviceId}
              </span>
            ))}
            {booking.totalPrice > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a2a] text-white">
                {booking.totalPrice} Kč
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onEdit(booking.id)}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(booking.id)}
            className="text-xs text-red-500 hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
