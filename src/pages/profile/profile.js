import { signOutSession } from "../../firebase/auth/auth.js"; 

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("logoutButton").addEventListener("click", async () => {
        try {
            await signOutSession();
            window.location.href = "/src/index.html";
        } catch (error) {
            console.error("Error al desconectar:", error);
        }
    });
});
