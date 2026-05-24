// Step 1: multi-select service picker grouped by category; sticky continue bar shows selection count
import { useData } from '../../context/DataContext'

const CATEGORY_LABELS = {
  haircut: 'Haircuts',
  coloring: 'Coloring',
  styling: 'Styling',
  care: 'Care',
}

export default function Step1_Services({ selected, onSelect, onNext }) {
  const { services, loading } = useData()

  const toggleService = (service) => {
    const exists = selected.find((s) => s.id === service.id)
    if (exists) {
      onSelect(selected.filter((s) => s.id !== service.id))
    } else {
      onSelect([...selected, service])
    }
  }

  const categories = [...new Set(services.map((s) => s.category))]

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Select Services</h2>
      <p className="text-gray-500 text-sm mb-6">
        You can select multiple services
      </p>

      {categories.map((category) => (
        <div key={category} className="mb-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            {category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {services
              .filter((s) => s.category === category)
              .map((service) => {
                const isSelected = selected.find((s) => s.id === service.id)
                return (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service)}
                    className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left
                      ${
                        isSelected
                          ? 'border-white bg-white text-black'
                          : 'border-[#2a2a2a] bg-[#141414] hover:border-gray-500'
                      }`}
                  >
                    <span className="font-medium text-sm">{service.name}</span>
                    <span className="text-xs mt-0.5 text-gray-500">
                      {service.duration} min
                    </span>
                  </button>
                )
              })}
          </div>
        </div>
      ))}

      {selected.length > 0 && (
        <div className="sticky bottom-4 mt-4">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-xl p-4">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-400">{selected.length} selected</span>
              <span>
                {selected.reduce((sum, s) => sum + s.duration, 0)} min total
              </span>
            </div>
            <button
              onClick={onNext}
              className="w-full bg-white text-black py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
