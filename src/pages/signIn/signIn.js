import { app } from "../../firebase/initializeDatabase.js";
import { signInWithGoogle, createUserEmail, sendMessageVerification } from "../../firebase/auth/auth.js"; 
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { saveUserInfoToLocal } from "../../firebase/firestore/saveUserInfoToLocal.js";
import { checkIfExists } from "../../firebase/firestore/checkIfDocExists.js";

document.addEventListener('DOMContentLoaded', function () {
    const google = document.getElementById('google_button');
    const registro = document.getElementById('registro');

    google.addEventListener("click", async function () {
        try {
            const result = await signInWithGoogle();
            const userCredential = result.user;
            const email = userCredential.email;

            const userExists = await checkIfExists('users', 'userEmail', email);
            if (!userExists) {
                await addUser(email); 
                await saveUserInfoToLocal(email);
            }
            window.location.href = "/src/index.html";
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
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
            await addUser(email.value); 
        } catch (error) {
            emailErrorDiv.textContent = 'Invalid email or password.';
            emailErrorDiv.classList.add('block');
        }
    });
});

async function addUser(emailValue) {
    try {
        const db = getFirestore(app);
        const rol = "Buyer";
        const photoPred = "/src/images/photoPred.png";
        const userName = emailValue.split('@')[0]; 
        const docRef = await addDoc(collection(db, 'users'), {
            userEmail: emailValue,
            userName: userName, 
            photo: photoPred,
            rol: rol
        });
        await saveUserInfoToLocal(emailValue);
        console.log("Document written with ID: ", docRef.id);
        window.location.href = "/src/index.html";
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}  
