import { auth } from "../initializeDatabase.js";
import{ signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';

const signInWithEmail = async (email, password) => {
    console.log(email,password)
    return await signInWithEmailAndPassword(auth, email, password);
};

const createUserEmail = async(email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
}; 

const sendMessageVerification = async() => {
  return await sendEmailVerification(auth.currentUser);
}; 


const signInWithGoogle = async () => {
  try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      return result;
  } catch (error) {
      throw error;
  }
}

const signOutSession = async() => {
  return await signOut(auth);
}; 


export { signInWithEmail, createUserEmail, signInWithGoogle , sendMessageVerification, signOutSession};