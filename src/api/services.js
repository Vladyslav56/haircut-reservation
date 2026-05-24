// Firestore CRUD for the 'services' collection
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../firebase'

export const fetchServices = async () => {
  const snap = await getDocs(collection(db, 'services'))
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const addService = async (data) => {
  return await addDoc(collection(db, 'services'), data)
}

export const updateService = async (id, data) => {
  return await updateDoc(doc(db, 'services', id), data)
}

export const deleteService = async (id) => {
  return await deleteDoc(doc(db, 'services', id))
}
