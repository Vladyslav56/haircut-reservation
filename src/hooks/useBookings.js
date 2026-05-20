import { useState } from 'react'
import { fetchBookingsByDate, createBooking } from '../services/bookings'

export const useBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Вызывается когда пользователь выбрал мастера и дату
  const getBookings = async (employeeId, date) => {
    setLoading(true)
    try {
      const data = await fetchBookingsByDate(employeeId, date)
      setBookings(data)
      return data
    } catch (err) {
      setError(err.message)
      return []
    } finally {
      setLoading(false)
    }
  }

  const addBooking = async (bookingData) => {
    setLoading(true)
    try {
      await createBooking(bookingData)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return { bookings, loading, error, getBookings, addBooking }
}
