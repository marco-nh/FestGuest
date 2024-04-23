import { app } from "../../firebase/initializeDatabase.js";
import { signInWithGoogle, createUserEmail, sendMessageVerification } from "../../firebase/auth/auth.js"; 
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";


document.addEventListener('DOMContentLoaded', function () {
    const google = document.getElementById('google_button');
    const registro = document.getElementById('registro');

    google.addEventListener("click", function () {
        signInWithGoogle();
        window.location.href = "/src/index.html";
    });
    

    registro.addEventListener('click', async (e) => {

        let email = document.getElementById('emailreg');
        let password = document.getElementById('passwordreg');
        let password2 = document.getElementById('password2reg');
        let emailErrorDiv = document.getElementById('emailreg-error');
        let passwordErrorDiv = document.getElementById('passwordreg-error');

        const tieneNum = /\d/.test(password.value);
        const tieneSimbolo = /[!@#$%&*(),.?":{}|<>]/.test(password.value);
        const minCharacters = "Password is less than 8 characters.";
        const formatPass = "Password does not meet the format requirements.";
        const notMatch ="Passwords do not match.";

        if (password.value.length < 8 || !tieneNum || !tieneSimbolo || password.value !== password2.value) {
            if (password.value.length < 8) {
                passwordErrorDiv.textContent = minCharacters;
            } else if (!tieneNum || !tieneSimbolo) {
                passwordErrorDiv.textContent = formatPass;
            } else {
                passwordErrorDiv.textContent = notMatch;
            }
            passwordErrorDiv.classList.remove('hidden');
            password.value = '';
            password2.value = '';
            return;
        }

        try {
            await createUserEmail(email.value, password.value);
            await sendMessageVerification();
            await addAccommodation(email.value, password.value); // adding user in firestore
        } catch (error) {
            emailErrorDiv.textContent = 'Invalid email or password.';
            emailErrorDiv.classList.add('block');
        }
    });
});

async function addAccommodation(emailValue, passwordValue) {
    try {
        const db = getFirestore(app);
        const rol = "Buyer";
        const photoPred = "/src/images/photoPred.png";
        const docRef = await addDoc(collection(db, 'users'), {
            userEmail: emailValue,
            photo: photoPred,
            rol: rol
        });
        console.log("Document written with ID: ", docRef.id);
        window.location.href = "/src/index.html";
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}   