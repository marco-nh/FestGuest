// Dependencias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js"; 
import{ getAuth } from 'https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js';


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
const database = getDatabase(app); 
const storage = getStorage(app);
const auth = getAuth(app);

export { app, database, storage, auth }; 