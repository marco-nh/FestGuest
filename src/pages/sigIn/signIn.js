import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import{sendEmailVerification, getAuth, signInWithPopup,
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

    const firebaseConfig = {
        apiKey: "AIzaSyDc0OBSYcfUWHP9XpTd8QTtSXRh__irX9g",
        authDomain: "festguest-9a2bd.firebaseapp.com",
        databaseURL: "https://festguest-9a2bd-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "festguest-9a2bd",
        storageBucket: "festguest-9a2bd.appspot.com",
        messagingSenderId: "271972611958",
        appId: "1:271972611958:web:236e9028654563bfa8ac57"
      };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


registro.addEventListener('click',(e) => {
    
    var email = document.getElementById('emailreg');
    var password = document.getElementById('passwordreg');
    var password2 = document.getElementById('password2reg');
    var emailErrorDiv = document.getElementById('emailreg-error');
    var passwordErrorDiv = document.getElementById('passwordreg-error');

    var emailactual = email.value;
    var passwordactual = password.value;

    emailErrorDiv.textContent = '';
    emailErrorDiv.style.display = 'none';
    passwordErrorDiv.textContent = '';
    passwordErrorDiv.style.display = 'none';

    const tieneNum = /\d/.test(passwordactual);
    const tieneSimbolo = /[!@#$%&*(),.?":{}|<>]/.test(passwordactual);

    if(passwordactual.length < 8){
        passwordErrorDiv.textContent = 'La tiene menos de 8 caracteres.';
        passwordErrorDiv.style.display = 'block';
        password.value = '';
        password2.value = '';
        return;
    }

    if(!tieneNum || !tieneSimbolo){
        passwordErrorDiv.textContent = 'La contraseña no cumple el formato.';
        passwordErrorDiv.style.display = 'block';
        password.value = '';
        password2.value = '';
        return;
    }

    if(password.value !== password2.value){
        passwordErrorDiv.textContent = "Las contraseñas no coinciden.";
        passwordErrorDiv.style.display = 'block';
        password.value = '';
        password2.value = '';
        return;
    }    

    createUserWithEmailAndPassword(auth,email.value,password.value).then(cred => {
        alert('Usuario creado');
        auth.signOut();
        sendEmailVerification(auth.currentUser).then(() => {
            alert('Se ha enviado un correo de verificación.');
        });
        window.location.href = "/src/pages/login/login.html";
        
    }).catch(error => {
        const erroCode = error.code;

        if(erroCode == 'auth/email-already-in-use'){
            emailErrorDiv.textContent = 'El correo ya está en uso.';
            emailErrorDiv.style.display = 'block';
        }else if(erroCode == 'auth/invalid-email'){
            emailErrorDiv.textContent = 'El formato del correo no es adecuado.';
            emailErrorDiv.style.display = 'block';
        }
    });
    
});
