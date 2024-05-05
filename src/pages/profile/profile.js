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


    var userPhoto = localStorage.getItem('userPhoto');
    var profileImage = document.getElementById('imgAvatar');
    if (userPhoto !== null && userPhoto !== undefined) {
        profileImage.src = userPhoto
    } else {
        // Si no hay valor en localStorage, mostrar un mensaje de error o establecer un valor predeterminado
        profileImage.src = "/src/images/photoPred.png"
    }
});


    

document.getElementById('imageUpload').addEventListener('change', function(event) {
    var input = event.target;
    var file = input.files[0];
    
    var reader = new FileReader();
    reader.onload = function() {
        var imageData = reader.result;
        // Guardar la imagen en localStorage
        localStorage.setItem('userPhoto', imageData)
    };
    reader.readAsDataURL(file);
    });        


// Obtener el elemento textarea
var textarea = document.getElementById('descripcion');
// Obtener el botón guardar
var guardarButton = document.getElementById('guardarButton');

// Función para guardar el texto en localStorage
function guardarTexto() {
    // Obtener el valor actual del textarea
    var texto = textarea.value;
    // Guardar el valor en localStorage con una clave específica
    localStorage.setItem('textoGuardado', texto);
}

// Escuchar el evento click en el botón guardar
guardarButton.addEventListener('click', guardarTexto);

// Al cargar la página, verificar si hay datos guardados en localStorage y mostrarlos en el textarea
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
