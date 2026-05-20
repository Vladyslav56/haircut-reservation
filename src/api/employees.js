import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

export const fetchEmployees = async () => {
  const snap = await getDocs(collection(db, 'employees'))
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const addEmployee = async (data) => {
  return await addDoc(collection(db, 'employees'), data)
}

export const updateEmployee = async (id, data) => {
  return await updateDoc(doc(db, 'employees', id), data)
}

export const deleteEmployee = async (id) => {
  return await deleteDoc(doc(db, 'employees', id))
}
