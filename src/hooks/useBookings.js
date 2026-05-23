import { useState } from 'react'
import {
  fetchBookingsByDate,
  fetchAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../api/bookings'

export default function useBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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

  const getAllBookings = async () => {
    setLoading(true)
    try {
      const data = await fetchAllBookings()
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

  const editBooking = async (id, data) => {
    setLoading(true)
    try {
      await updateBooking(id, data)
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...data } : b)),
      )
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const removeBooking = async (id) => {
    setLoading(true)
    try {
      await deleteBooking(id)
      setBookings((prev) => prev.filter((b) => b.id !== id))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return {
    bookings,
    loading,
    error,
    getBookings,
    getAllBookings,
    addBooking,
    editBooking,
    removeBooking,
  }
}
