// Firestore CRUD for the 'exceptions' collection (employee days off)
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
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

export const fetchAllExceptions = async () => {
  const snap = await getDocs(collection(db, 'exceptions'))
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const updateException = async (id, data) => {
  return await updateDoc(doc(db, 'exceptions', id), data)
}

export const deleteException = async (id) => {
  return await deleteDoc(doc(db, 'exceptions', id))
}
