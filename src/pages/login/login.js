import { signInWithEmail } from "../../firebase/auth/auth.js";
import { showMessage } from "../../utils/toastMessage/toastMessage.js";
import { saveUserInfoToLocal } from "../../firebase/firestore/saveUserInfoToLocal.js";

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault(); 
        let email = document.getElementById('emaillog').value;
        let password = document.getElementById('passwordlog').value;
        try {
            await signInWithEmail(email, password);
            await saveUserInfoToLocal(email);
            window.location.href = "/src/index.html";
        } catch (error) {
            showMessage("Invalid email or password", "warning");
        }
    });
});

