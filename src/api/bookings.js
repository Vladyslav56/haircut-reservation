import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

export const fetchBookingsByDate = async (employeeId, date) => {
  const q = query(
    collection(db, 'bookings'),
    where('employeeId', '==', employeeId),
    where('date', '==', date),
  )
  const snap = await getDocs(q)
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const fetchAllBookings = async () => {
  const q = query(collection(db, 'bookings'), orderBy('date', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const createBooking = async (data) => {
  return await addDoc(collection(db, 'bookings'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export const updateBooking = async (id, data) => {
  return await updateDoc(doc(db, 'bookings', id), data)
}

export const deleteBooking = async (id) => {
  return await deleteDoc(doc(db, 'bookings', id))
}
