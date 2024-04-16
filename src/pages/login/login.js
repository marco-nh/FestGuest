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

//const cerrarButton = document.getElementById(cerrar);

login.addEventListener('click',(e) => {
    
    var email = document.getElementById('emaillog');
    var password = document.getElementById('passwordlog');
    //var emailErrorDiv = document.getElementById('email-error');
   // var passwordErrorDiv = document.getElementById('password-error');
/*
    emailErrorDiv.textContent = '';
    emailErrorDiv.style.display = 'none';
    passwordErrorDiv.textContent = '';
    passwordErrorDiv.style.display = 'none';
*/
    signInWithEmailAndPassword(auth,email.value,password.value).then(cred => {
        console.error("error2");
        alert('Usuario logueado');
        console.log(cred.user);
        window.open('https://google.com/')
    }).catch(error => {
        const erroCode = error.code;
        /*
        console.error('error');
        if(erroCode == 'auth/invalid-email'){
            emailErrorDiv.textContent = 'El email o la contraseña están incorrectos';
            emailErrorDiv.style.display = 'block';
            email.value = '';
            password.value = '';
        }else{
            emailErrorDiv.textContent = 'El email o la contraseña están incorrectos';
            emailErrorDiv.style.display = 'block';
            email.value = '';
            password.value = '';
        }
    });*/
});
/*
cerrar.addEventListener('click', (e) => {
    auth.signOut().then(() => {
        window.location.href = '/pages/registro.html';
    }).catch((error) => {
        alert('Error al cerrar sesion');
    });
})
*/
auth.onAuthStateChanged(user => {
    if(user){
        console.log("Usuario activo");
        var email = user.emailVerified;
        if(user.emailVerified){
            //window.open('https://google.com/')
        }else{
            console.log('Email no verificado')
            auth.signOut();
        }
    }else{
        console.log("Usuario Inactivo");
    }
})
})