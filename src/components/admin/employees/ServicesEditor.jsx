// Checkbox selector for employee services grouped by category, with price input per selected service
import { useData } from '../../../context/DataContext'

const CATEGORIES = [
  { value: 'haircut', label: 'Haircuts' },
  { value: 'coloring', label: 'Coloring' },
  { value: 'styling', label: 'Styling' },
  { value: 'care', label: 'Care' },
]

export default function ServicesEditor({ selectedServices, onChange }) {
  const { services } = useData()

  const isSelected = (serviceId) =>
    selectedServices.some((s) => s.serviceId === serviceId)

  const getPrice = (serviceId) => {
    const entry = selectedServices.find((s) => s.serviceId === serviceId)
    return entry ? entry.price : ''
  }

  const toggleService = (serviceId) => {
    if (isSelected(serviceId)) {
      onChange(selectedServices.filter((s) => s.serviceId !== serviceId))
    } else {
      onChange([...selectedServices, { serviceId, price: 0 }])
    }
  }

  const updatePrice = (serviceId, price) => {
    onChange(
      selectedServices.map((s) =>
        s.serviceId === serviceId ? { ...s, price: Number(price) } : s,
      ),
    )
  }

  return (
    <div className="space-y-4">
      {CATEGORIES.map(({ value, label }) => {
        const group = services.filter((s) => s.category === value)
        if (!group.length) return null
        return (
          <div key={value}>
            <p className="text-xs font-medium text-[#888] mb-2">{label}</p>
            <div className="space-y-2">
              {group.map((service) => {
                const selected = isSelected(service.id)
                return (
                  <div key={service.id} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all shrink-0 ${
                        selected
                          ? 'border-white bg-white'
                          : 'border-[#2a2a2a] bg-[#141414] hover:border-gray-500'
                      }`}
                    >
                      {selected && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="black"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                    <span className="text-sm flex-1">{service.name}</span>
                    {selected && (
                      <input
                        type="number"
                        min="0"
                        value={getPrice(service.id)}
                        onChange={(e) => updatePrice(service.id, e.target.value)}
                        placeholder="Price"
                        className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-3 py-1.5 text-sm outline-none focus:border-gray-500 transition-colors w-28"
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
