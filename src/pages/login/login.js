import { signInWithEmail } from "/src/firebase/auth/auth.js";
import { showMessage } from "../../utils/toastMessage/toastMessage.js";

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault(); 
      var email = document.getElementById('emaillog').value;
      var password = document.getElementById('passwordlog').value;
      try {
        await signInWithEmail(email, password);
        window.location.href = "/src/index.html";
      } catch (error) {
        showMessage("Invalid email or password", "warning");
      }
    });
  });
