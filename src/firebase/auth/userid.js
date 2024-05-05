//firebase
import { app } from "../../firebase/initializeDatabase.js";
import {query,where, getDocs, getFirestore, collection} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", log);

async function log(){
    const userDocString = localStorage.getItem('userDoc');
    if (userDocString) {
        const db = getFirestore(app);
        const userDoc = JSON.parse(userDocString);          
        const querySnapshot = await getDocs(query(collection(db, 'users'), where('userEmail', '==', userDoc.userEmail)));
        
        querySnapshot.forEach((userdata) => {
            //para evitar otra busqueda, agrego la id del usuario y lo meto en local
            localStorage.setItem("userId",userdata.id)
            console.log("Guardado en local la ref de usuario (warning)")
        })
    }
}