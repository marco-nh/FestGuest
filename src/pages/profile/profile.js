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

    var correols = localStorage.getItem('userEmail');

    var correo = document.getElementById('correo');
    
    if (correols !== null && correols !== undefined) {
        correo.textContent = correols;
    } else {
        correo.textContent = 'No hay correo asociado a esta cuenta';
    }    

    var userDocString = localStorage.getItem('userDoc');
    var userDocObject = JSON.parse(userDocString);
    var userName = userDocObject.userName;
    var nombre = document.getElementById('nombre');
    
    if (userName !== null && userName !== undefined) {
        nombre.textContent = userName;
    } else {
        nombre.textContent = 'No hay nombre asociado a esta cuenta';
    }
    
    renderSuscriptionFestivals()
    actionSuscriptionListener()


    var userPhoto = localStorage.getItem('userPhoto');
    var profileImage = document.getElementById('imgAvatar');
    if (userPhoto !== null && userPhoto !== undefined) {
        profileImage.src = userPhoto
    } else {
        profileImage.src = "/src/images/photoPred.png"
    }
});


    

document.getElementById('imageUpload').addEventListener('change', function(event) {
    var input = event.target;
    var file = input.files[0];
    
    var reader = new FileReader();
    reader.onload = function() {
        var imageData = reader.result;
        localStorage.setItem('userPhoto', imageData)
    };
    reader.readAsDataURL(file);
    });        


var textarea = document.getElementById('descripcion');
var guardarButton = document.getElementById('guardarButton');

function guardarTexto() {
    var texto = textarea.value;
    localStorage.setItem('textoGuardado', texto);
}

guardarButton.addEventListener('click', guardarTexto);

window.addEventListener('load', function() {
    var textoGuardado = localStorage.getItem('textoGuardado');
    if (textoGuardado !== null) {
        textarea.value = textoGuardado;
    }
});

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
    arrayReservados = arrayReservados.filter(e => e !== fiesta); 
    localStorage.setItem("eventosSuscritos",JSON.stringify(arrayReservados))

    const userRef = doc(db, "users", localStorage.getItem("userId"));
    await setDoc(userRef, { festivalAsociado: arrayReservados }, { merge: true });
    location.reload()
}
