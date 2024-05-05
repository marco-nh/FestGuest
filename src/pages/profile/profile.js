import { signOutSession } from "../../firebase/auth/auth.js"; 

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
})



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

document.addEventListener('DOMContentLoaded', function() {

    var userPhoto = localStorage.getItem('userPhoto');
    if (userPhoto !== null && userPhoto !== undefined) {

        var profileImage = this.getElementById('img')
        profileImage.src = userPhoto
        console.log(userPhoto)
    } else {
        // Si no hay valor en localStorage, mostrar un mensaje de error o establecer un valor predeterminado
        profileImage.src = "/src/images/photoPred.png"
    }
    })

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
