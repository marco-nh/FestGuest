import { app } from "../initializeDatabase.js";
import { collection,getFirestore, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

const saveUserInfoToLocal = async (email) => {
    try {
      const db = getFirestore(app);
      const querySnapshot = await getDocs(query(collection(db, 'users'), where('userEmail', '==', email)));
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        localStorage.setItem('userDoc', JSON.stringify(userDoc)); 
    }
    } catch (error) {
        console.error("Error al guardar la información del usuario en el localStorage:", error);
    }
};

export { saveUserInfoToLocal }