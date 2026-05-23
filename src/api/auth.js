import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase'

export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
