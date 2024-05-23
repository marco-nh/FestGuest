import { app } from "../../firebase/initializeDatabase.js";
import { doc,getDoc, setDoc, getFirestore} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

document.getElementById("addbutton").addEventListener("click",addCurrency)
document.addEventListener("DOMContentLoaded",initialize)

function initialize(){
    console.log("Initialized")
    getCurrency()
}

async function getCurrency(){
    const currencyLabel = document.getElementById("monedas")
    const db = getFirestore(app);

    if (localStorage.getItem("userId") == null){
        console.log("No debería de poderse hacer esto")
        return false
    }

    const userRef = doc(db, "users", localStorage.getItem("userId"));
    const datos = await getDoc(userRef)
    if (datos.data().money != null){
        currencyLabel.textContent = datos.data().money
        localStorage.setItem("currency",datos.data().money);
    }
    else {
        currencyLabel.textContent = 0;
        localStorage.setItem("currency", 0);
    }
    showCurrency()
}

function showCurrency(){
    const currencyClass = document.getElementById("currentModule")
    const reloading = document.getElementById("cargando")
    currencyClass.classList.remove("hidden")
    reloading.classList.add("hidden")
}

async function addCurrency(){
    const db = getFirestore(app);
    if (localStorage.getItem("userId") == null){
        return false
    } 
    const userRef = doc(db, "users", localStorage.getItem("userId"));


    let money = parseInt(localStorage.getItem("currency"))
    money += 50
    await setDoc(userRef, { money: money }, { merge: true });
    localStorage.setItem("currency",money);
    location.reload()
}