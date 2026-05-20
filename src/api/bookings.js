import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
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

export const createBooking = async (data) => {
  return await addDoc(collection(db, 'bookings'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}
