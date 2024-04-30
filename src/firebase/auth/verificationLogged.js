import { auth } from "../initializeDatabase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.19.0/firebase-auth.js";
document.addEventListener('DOMContentLoaded', function () {
    const header = document.getElementById('header');
    const headerLogged = document.getElementById('headerLogged');
    const userEmailElement = document.getElementById('imageUser');

    const updateProfilePhoto = () => {
        try {
            const userDocString = localStorage.getItem('userDoc');
            
            if (userDocString) {
                const userDoc = JSON.parse(userDocString);            
                const photoURL = userDoc.photo;
                const userName = userDoc.userName;

                const profileImage = document.querySelector('#imageUserElement');
                if (profileImage) {
                    profileImage.src = photoURL;
                }
                
                const userNameElement = document.querySelector('#userNameElement');
                if (userNameElement) {
                    userNameElement.textContent = userName;
                }
            } else {
                console.log("No se encontraron datos de usuario en el localStorage");
            }
        } catch (error) {
            console.error("Error al actualizar la foto de perfil:", error);
        }
    };

    window.addEventListener('load', () => {
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            updateProfilePhoto();
        }
    });
    

    onAuthStateChanged(auth, async (user) => {
        if (user) { // Usuario logeado
            header.classList.add('hidden');
            headerLogged.classList.remove('hidden');

            const userEmail = user.email;
            localStorage.setItem('userEmail', userEmail);

            if (userEmailElement) {
                userEmailElement.textContent = userEmail;
            }

            updateProfilePhoto();
        } else {
            header.classList.remove('hidden');
            headerLogged.classList.add('hidden');

            localStorage.removeItem('userEmail');
        }
    });
});
