// Groups services by category and renders a ServiceCard for each
import ServiceCard from './ServiceCard'

const CATEGORIES = [
  { value: 'haircut', label: 'Haircuts' },
  { value: 'coloring', label: 'Coloring' },
  { value: 'styling', label: 'Styling' },
  { value: 'care', label: 'Care' },
]

export default function ServicesList({ services, editingId, onEdit, onSave, onCancel, onDelete }) {
  return (
    <div className="space-y-6">
      {CATEGORIES.map(({ value, label }) => {
        const group = services.filter((s) => s.category === value)
        if (!group.length) return null
        return (
          <div key={value}>
            <p className="text-sm font-medium text-[#888] mb-3">{label}</p>
            <div className="space-y-2">
              {group.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isEditing={editingId === service.id}
                  onEdit={onEdit}
                  onSave={onSave}
                  onCancel={onCancel}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
