import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

export const fetchExceptionsByEmployee = async (employeeId) => {
  const q = query(
    collection(db, 'exceptions'),
    where('employeeId', '==', employeeId),
  )
  const snap = await getDocs(q)
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const addException = async (data) => {
  return await addDoc(collection(db, 'exceptions'), data)
}

export const deleteException = async (id) => {
  return await deleteDoc(doc(db, 'exceptions', id))
}
