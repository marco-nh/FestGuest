import { signOutSession } from "../../firebase/auth/auth.js"; 

// Esperar a que se cargue todo el contenido del DOM
document.addEventListener("DOMContentLoaded", () => {
    // Escuchar el evento de clic en el botón de desconexión
    document.getElementById("logoutButton").addEventListener("click", async () => {
        try {
            // Realizar la función de desconexión
            await signOutSession();
            // Redirigir a la página de inicio de sesión u otra página relevante
            window.location.href = "/src/index.html";
        } catch (error) {
            console.error("Error al desconectar:", error);
            // Manejar errores si es necesario
        }
    });
});
