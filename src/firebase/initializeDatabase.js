//Para usar los servicios de Firebase en otro js basta con hacer un import rollo:
//import app from "..\src\firebase\databaseInitialize.js"
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDc0OBSYcfUWHP9XpTd8QTtSXRh__irX9g",
  authDomain: "festguest-9a2bd.firebaseapp.com",
  databaseURL: "https://festguest-9a2bd-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "festguest-9a2bd",
  storageBucket: "festguest-9a2bd.appspot.com",
  messagingSenderId: "271972611958",
  appId: "1:271972611958:web:236e9028654563bfa8ac57"
};

const app = initializeApp(firebaseConfig);

if (app) {
    console.log("Firebase se inicializó correctamente.");
  } else {
    console.log("Firebase no se inicializó.");
  }

export default app;