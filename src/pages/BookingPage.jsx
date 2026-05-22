import { useData } from '../context/DataContext'
import BookingWizard from '../components/booking/BookingWizard'
import Header from '../components/Header/Header'

export default function BookingPage() {
  const { services, employees, loading, error } = useData()

  return (
    <>
      <Header />
      <div className="container">
        <BookingWizard />
      </div>
    </>
  )
}
