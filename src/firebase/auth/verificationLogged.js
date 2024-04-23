import { auth } from "../initializeDatabase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js";

const header = document.getElementById('header');
const headerLogged = document.getElementById('headerLogged');

onAuthStateChanged(auth, async(user) =>{
    if (user) {
        // Usuario logeado
        header.classList.add('hidden');
        headerLogged.classList.remove('hidden');
    } else {
        // Usuario no logeado
        header.classList.remove('hidden');
        headerLogged.classList.add('hidden');
    }
});




