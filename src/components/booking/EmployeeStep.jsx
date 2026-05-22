import { useData } from '../../context/DataContext'

export default function EmployeeStep({
  selected,
  selectedServices,
  onSelect,
  onNext,
  onBack,
}) {
  const { employees, loading } = useData()

  const available = employees.filter((emp) =>
    selectedServices.every((service) =>
      emp.services.some((s) => s.serviceId === service.id),
    ),
  )

  const getPrice = (employee, serviceId) => {
    const found = employee.services.find((s) => s.serviceId === serviceId)
    return found ? found.price : 0
  }

  const getTotalPrice = (employee) => {
    return selectedServices.reduce((sum, service) => {
      return sum + getPrice(employee, service.id)
    }, 0)
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Select Master</h2>
      <p className="text-gray-500 text-sm mb-6">
        Showing masters available for your selected services
      </p>

      {available.length === 0 && (
        <p className="text-gray-500 text-sm">
          No masters available for selected services
        </p>
      )}

      <div className="flex flex-col gap-2">
        {available.map((employee) => {
          const isSelected = selected?.id === employee.id
          return (
            <button
              key={employee.id}
              onClick={() => onSelect(employee)}
              className={`flex justify-between items-center p-4 rounded-xl border transition-all text-left
                ${
                  isSelected
                    ? 'border-white bg-white text-black'
                    : 'border-[#2a2a2a] bg-[#141414] hover:border-gray-500'
                }`}
            >
              <div>
                <p className="font-medium">{employee.name}</p>
                <p
                  className={`text-xs mt-0.5 ${isSelected ? 'text-gray-500' : 'text-gray-500'}`}
                >
                  {employee.level}
                </p>
              </div>
              <p className="font-medium text-sm">
                from {getTotalPrice(employee)} Kč
              </p>
            </button>
          )
        })}
      </div>

      <div className="flex gap-2 mt-6">
        <button onClick={onBack} className="btn-outline">
          Back
        </button>
        {selected && (
          <button onClick={onNext} className="btn-primary">
            Continue
          </button>
        )}
      </div>
    </div>
  )
}
