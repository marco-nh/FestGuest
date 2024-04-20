import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import{sendEmailVerification, getAuth,createUserWithEmailAndPassword,
     signInWithPopup, GoogleAuthProvider} from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

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
const provider = new GoogleAuthProvider();
const google = document.getElementById('google_button');


google.addEventListener("click", function(){
    signInWithPopup(auth, provider)
  .then((result) => {
    GoogleAuthProvider.credentialFromResult(result);
    window.location.href = "/src/pages/login/login.html";
  }).catch((error) => {
    GoogleAuthProvider.credentialFromError(error);
  });
})


registro.addEventListener('click',(e) => {
    
    let email = document.getElementById('emailreg');
    let password = document.getElementById('passwordreg');
    let password2 = document.getElementById('password2reg');
    let emailErrorDiv = document.getElementById('emailreg-error');
    let passwordErrorDiv = document.getElementById('passwordreg-error');

    let passwordactual = password.value;

    emailErrorDiv.textContent = '';
    emailErrorDiv.classList.add('hidden');
    passwordErrorDiv.textContent = '';
    passwordErrorDiv.classList.add('hidden');

    const tieneNum = /\d/.test(passwordactual);
    const tieneSimbolo = /[!@#$%&*(),.?":{}|<>]/.test(passwordactual);

    if(passwordactual.length < 8){
        passwordErrorDiv.textContent = 'La tiene menos de 8 caracteres.';
        passwordErrorDiv.classList.remove('hidden');
        password.value = '';
        password2.value = '';
        return;
    }

    if(!tieneNum || !tieneSimbolo){
        passwordErrorDiv.textContent = 'La contraseña no cumple el formato.';
        passwordErrorDiv.classList.remove('hidden');
        password.value = '';
        password2.value = '';
        return;
    }

    if(password.value !== password2.value){
        passwordErrorDiv.textContent = "Las contraseñas no coinciden.";
        passwordErrorDiv.classList.remove('hidden');
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
            emailErrorDiv.classList.add('block');
        }else if(erroCode == 'auth/invalid-email'){
            emailErrorDiv.textContent = 'El formato del correo no es adecuado.';
            emailErrorDiv.classList.add('block');
        }
    });
    
});
