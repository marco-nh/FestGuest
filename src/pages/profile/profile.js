import { signOutSession } from "../../firebase/auth/auth.js"; 
import { app } from "../../firebase/initializeDatabase.js";
import { doc, setDoc, getFirestore} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("logoutButton").addEventListener("click", () => {
        signOutSession()
            .then(() => {
                window.location.href = "/src/index.html";
            })
            .catch((error) => {
                console.error("Error al desconectar:", error);
            });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    
    var correols = localStorage.getItem('userEmail');

    // Obtener el elemento div por su ID
    var correo = document.getElementById('correo');
    
    // Verificar si el valor de localStorage no es null o undefined
    if (correols !== null && correols !== undefined) {
        // Establecer el valor de localStorage como el contenido del div
        correo.textContent = correols;
    } else {
        // Si no hay valor en localStorage, mostrar un mensaje de error o establecer un valor predeterminado
        correo.textContent = 'No hay correo asociado a esta cuenta';
    }    
})
    
document.addEventListener('DOMContentLoaded', function() {
    
    var userDocString = localStorage.getItem('userDoc');
    var userDocObject = JSON.parse(userDocString);
    var userName = userDocObject.userName;
    // Obtener el elemento div por su ID
    var nombre = document.getElementById('nombre');
    
    // Verificar si el valor de localStorage no es null o undefined
    if (userName !== null && userName !== undefined) {
        // Establecer el valor de localStorage como el contenido del div
        nombre.textContent = userName;
    } else {
        // Si no hay valor en localStorage, mostrar un mensaje de error o establecer un valor predeterminado
        nombre.textContent = 'No hay nombre asociado a esta cuenta';
    }
    
    renderSuscriptionFestivals()
    actionSuscriptionListener()
})

function renderSuscriptionFestivals(){
    const eventsLabel = document.getElementById("suscritos")

    const eventsSuscription = JSON.parse(localStorage.getItem("eventosSuscritos"))
    let num = 0;
    eventsSuscription.forEach(element => {
        num += 1;
        const divElementos = document.createElement("div")
        divElementos.classList.add("flex")
        divElementos.classList.add("flex-row")
        divElementos.classList.add("align-items-center")

        const card = document.createElement('a');
        card.classList.add("my-1")
        card.classList.add("w-1/2")
        card.textContent = element

        const elementopage = btoa(encodeURIComponent(element))
        card.href = `/src/pages/events/events.html?search=${elementopage}`;
        card.setAttribute("id","labeleventname"+num)
        divElementos.appendChild(card)

        const deletebutton = document.createElement('button');
        deletebutton.setAttribute('type', 'button');
        deletebutton.classList.add("btn")
        deletebutton.classList.add("btn-danger")
        deletebutton.classList.add("mx-2")
        deletebutton.setAttribute("id","eventname"+num)

        deletebutton.textContent = "Delete"
        
        divElementos.appendChild(deletebutton)
        eventsLabel.appendChild(divElementos)
        
    });
    console.log("renderizado")
}
function actionSuscriptionListener(){
    const eventsSuscription = JSON.parse(localStorage.getItem("eventosSuscritos"))

    let btns = document.querySelectorAll('button');

    btns.forEach(function (i) {
        if(i.textContent == "Delete"){
            i.addEventListener("click", function() {deleteSuscription(i.getAttribute("id"))})
        }
    });
}
async function deleteSuscription(eventname){
    const db = getFirestore(app);
    const fiesta = document.getElementById('label'+eventname).textContent
    console.log(fiesta)
    let arrayReservados = JSON.parse(localStorage.getItem("eventosSuscritos"))
    arrayReservados = arrayReservados.filter(e => e !== fiesta); // will return ['A', 'C']
    localStorage.setItem("eventosSuscritos",JSON.stringify(arrayReservados))

    const userRef = doc(db, "users", localStorage.getItem("userId"));
    await setDoc(userRef, { festivalAsociado: arrayReservados }, { merge: true });
    location.reload()
}
