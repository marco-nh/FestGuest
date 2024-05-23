import { app } from "../../firebase/initializeDatabase.js";
import { signInWithGoogle, createUserEmail, sendMessageVerification } from "../../firebase/auth/auth.js"; 
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { saveUserInfoToLocal } from "../../firebase/firestore/saveUserInfoToLocal.js";
import { checkIfExists } from "../../firebase/firestore/checkIfDocExists.js";

document.addEventListener('DOMContentLoaded', function () {
    const google = document.getElementById('google_button');
    const registro = document.getElementById('registro');

    google.addEventListener("click", () => {
        handleGoogleButtonClick().catch(error => {
            console.error("Error handling Google button click:", error);
        });
    });

    registro.addEventListener('click', (event) => {
        handleRegistroClick(event).catch(error => {
            console.error("Error during registration:", error);
            const emailErrorDiv = document.getElementById('emailreg-error');
            emailErrorDiv.textContent = 'Invalid email or password.';
            emailErrorDiv.classList.add('block');
        });
    });    
});

async function handleRegistroClick(event) {
    try {
        event.preventDefault();

        const email = document.getElementById('emailreg').value;
        const password = document.getElementById('passwordreg').value;
        const password2 = document.getElementById('password2reg').value;
        const passwordErrorDiv = document.getElementById('passwordreg-error');

        const tieneNum = /\d/.test(password);
        const tieneSimbolo = /[!@#$%&*(),.?":{}|<>]/.test(password);
        const minCharacters = "Password is less than 8 characters.";
        const formatPass = "Password does not meet the format requirements.";
        const notMatch = "Passwords do not match.";

        if (password.length < 8 || !tieneNum || !tieneSimbolo || password !== password2) {
            if (password.length < 8) {
                passwordErrorDiv.textContent = minCharacters;
            } else if (!tieneNum || !tieneSimbolo) {
                passwordErrorDiv.textContent = formatPass;
            } else {
                passwordErrorDiv.textContent = notMatch;
            }
            passwordErrorDiv.classList.remove('hidden');
            return;
        }

        // Crear usuario con correo electrónico
        await createUserEmail(email, password);
        await sendMessageVerification();
        await addUser(email);

    } catch (error) {
        console.error("Error during registration:", error);
        const emailErrorDiv = document.getElementById('emailreg-error');
        emailErrorDiv.textContent = 'Invalid email or password.';
        emailErrorDiv.classList.add('block');
    }
}


async function handleGoogleButtonClick() {
    try {
        const result = await signInWithGoogle();
        const userCredential = result.user;
        const email = userCredential.email;

        const userExists = await checkIfExists('users', 'userEmail', email);
        if (!userExists) {
            await addUser(email); 
            await saveUserInfoToLocal(email);
        }
        window.location.href = "./src/index.html";
    } catch (error) {
        console.error("Error signing in with Google:", error);
    }
}

async function addUser(emailValue) {
    try {
        const db = getFirestore(app);
        const rol = "Buyer";
        const photoPred = "./src/images/photoPred.png";
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
