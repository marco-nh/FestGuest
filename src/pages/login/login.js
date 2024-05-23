import { signInWithEmail } from "../../firebase/auth/auth.js";
import { showMessage } from "../../utils/toastMessage/toastMessage.js";
import { saveUserInfoToLocal } from "../../firebase/firestore/saveUserInfoToLocal.js";

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin()
            .then(() => {
                window.location.href = "./../../../src/index.html";
            })
            .catch((error) => {
                showMessage("Invalid email or password", "warning");
            });
    });
});

async function handleLogin() {
    let email = document.getElementById('emaillog').value;
    let password = document.getElementById('passwordlog').value;
    await signInWithEmail(email, password);
    await saveUserInfoToLocal(email);
    window.location.href = "./../../../src/index.html";
}
