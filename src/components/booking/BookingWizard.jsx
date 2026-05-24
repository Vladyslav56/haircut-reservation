// 4-step booking wizard: 1 services → 2 employee → 3 date/time → 4 client info
import { useState } from 'react'
import ServicesStep from './ServicesStep'
import EmployeeStep from './EmployeeStep'
import DateTimeStep from './DateTimeStep'
import ClientDataStep from './ClientDataStep'

export default function BookingWizard() {
  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState({
    services: [],
    employee: null,
    date: null,
    time: null,
    client: { name: '', email: '', phone: '' },
  })

  const update = (field, value) =>
    setBooking((prev) => ({ ...prev, [field]: value }))

  return (
    <div>
      {step === 1 && (
        <ServicesStep
          selected={booking.services}
          onSelect={(value) => update('services', value)}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <EmployeeStep
          selected={booking.employee}
          selectedServices={booking.services}
          onSelect={(value) => update('employee', value)}
          onNext={() => setStep(3)}
          onBack={() => {
            setStep(1)
            update('employee', null)
          }}
        />
      )}
      {step === 3 && (
        <DateTimeStep
          employee={booking.employee}
          selectedServices={booking.services}
          selected={{ date: booking.date, time: booking.time }}
          onSelect={(date, time) => {
            update('date', date)
            update('time', time)
          }}
          onNext={() => setStep(4)}
          onBack={() => {
            update('date', null)
            update('time', null)
            setStep(2)
          }}
        />
      )}
      {step === 4 && (
        <ClientDataStep booking={booking} onBack={() => setStep(3)} />
      )}
    </div>
  )
}
