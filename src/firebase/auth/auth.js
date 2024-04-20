import { auth } from "../initializeDatabase.js";
import{ signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';



const signInWithEmail = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};


export { signInWithEmail };