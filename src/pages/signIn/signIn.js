import { signInWithGoogle, createUserEmail, sendMessageVerification } from "../../firebase/auth/auth.js";

document.addEventListener('DOMContentLoaded', function () {
    const google = document.getElementById('google_button');
    const registro = document.getElementById('registro');

    google.addEventListener("click", function () {
        signInWithGoogle();
    });

    registro.addEventListener('click', async (e) => {

        let email = document.getElementById('emailreg');
        let password = document.getElementById('passwordreg');
        let password2 = document.getElementById('password2reg');
        let emailErrorDiv = document.getElementById('emailreg-error');
        let passwordErrorDiv = document.getElementById('passwordreg-error');

        const tieneNum = /\d/.test(password.value);
        const tieneSimbolo = /[!@#$%&*(),.?":{}|<>]/.test(password.value);
        const minCharacters = "Password is less than 8 characters."
        if (password.value.length < 8 || !tieneNum || !tieneSimbolo || password.value !== password2.value) {
            if (password.value.length < 8) {
                passwordErrorDiv.textContent = minCharacters;
            } else if (!tieneNum || !tieneSimbolo) {
                passwordErrorDiv.textContent = 'Password does not meet the format requirements.';
            } else {
                passwordErrorDiv.textContent = 'Passwords do not match.';
            }
            passwordErrorDiv.classList.remove('hidden');
            password.value = '';
            password2.value = '';
            return;
        }

        try {
            await createUserEmail(email.value, password.value);
            await sendMessageVerification();
        } catch (error) {
            emailErrorDiv.textContent = 'Invalid email or password.';
            emailErrorDiv.classList.add('block');
        }
    });
});

