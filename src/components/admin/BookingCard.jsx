import { useData } from '../../context/DataContext'

export default function BookingCard({ booking, onEdit, onDelete }) {
  const { employees } = useData()

  const getEmployeeName = (id) => {
    const emp = employees.find((e) => e.id === id)
    return emp ? emp.name : id
  }

  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-medium">{booking.timeStart}</span>
            <span className="text-gray-500 text-sm">→</span>
            <span className="text-gray-500 text-sm">{booking.timeEnd}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a2a] text-gray-400">
              {getEmployeeName(booking.employeeId)}
            </span>
          </div>
          <p className="font-medium">{booking.clientName}</p>
          <p className="text-gray-500 text-sm">{booking.clientPhone}</p>
          <p className="text-gray-500 text-sm">{booking.clientEmail}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {booking.services.map((s) => (
              <span
                key={s.serviceId}
                className="text-xs px-2 py-0.5 rounded-full bg-[#2a2a2a] text-gray-400"
              >
                {s.serviceId}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(booking)}
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
