// Display card for a single service; swaps to ServiceEditForm when isEditing
import ServiceEditForm from './ServiceEditForm'

export default function ServiceCard({ service, isEditing, onEdit, onSave, onCancel, onDelete }) {
  if (isEditing) {
    return <ServiceEditForm service={service} onSave={onSave} onCancel={onCancel} />
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium">{service.name}</p>
          <p className="text-gray-500 text-sm mt-0.5">{service.duration} min</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(service.id)}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(service.id)}
            className="text-xs text-red-500 hover:text-red-400 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
