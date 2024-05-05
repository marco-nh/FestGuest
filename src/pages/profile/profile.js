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

