//Faltaria lo que tiene que ver con firebase: tanto el verificar que los usuarios registrados pueden entrar a esta url

import { app } from "/src/firebase/initializeDatabase.js"; // Importa la instancia de Firebase desde initializeDatabase.js
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"; // Importa las funciones necesarias de Firestore


document.addEventListener('DOMContentLoaded', (event) => {

  agregarSugerencias('origen', 'origen-suggestions');
  agregarSugerencias('destino', 'destino-suggestions');

  validacionFormulario();
    
});

function agregarSugerencias(inputId, suggestionsId) {
  const input = document.getElementById(inputId);
  const suggestionsPanel = document.getElementById(suggestionsId);

  input.addEventListener('input', function() {
    const query = this.value;

    if(query.length < 3) { 
      suggestionsPanel.innerHTML = '';
      return;
    }

    fetch(`https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=BsJ3AWQpgcXR8jiUM4E6AAYYgjNopDLy&limit=3&countrySet=ES`)
      .then(response => response.json())
      .then(data => {
        suggestionsPanel.innerHTML = ''; 
        data.results.forEach(result => {
          const div = document.createElement('div');
          div.innerHTML = result.address.freeformAddress;
          div.classList.add('suggestion-item');
          div.addEventListener('click', function() {
            input.value = result.address.freeformAddress;
            suggestionsPanel.innerHTML = ''; 
          });

          suggestionsPanel.appendChild(div);
        });
      })
      .catch(error => console.log('Error:', error));
  });
}

async function validacionFormulario() {
  document.getElementById('rutaForm').addEventListener('submit', async function(event) {
      event.preventDefault();

      let nombreAnuncioCoche = document.getElementById('nombreAnuncioCoche').value;
      let origen = document.getElementById('origen').value;
      let destino = document.getElementById('destino').value;
      let numeroAsientosLibres = document.getElementById('numeroAsientosLibres').value;
      let descripcion = document.getElementById('descripcion').value;
      let precio = document.getElementById('precio').value;

      if (!nombreAnuncioCoche || !origen || !destino || !numeroAsientosLibres || !descripcion || !precio) {
          alert("All fields are required. Please fill out the entire form.");
      } else if(descripcion.length < 20){
          alert("Description must be at least 20 characters long")
      } else {
          const db = getFirestore(app);
          try {
              const docRef = await addDoc(collection(db, 'transports'), {
                  nombreAnuncioCoche: nombreAnuncioCoche,
                  origen: origen,
                  destino: destino,
                  numeroAsientosLibres: numeroAsientosLibres,
                  descripcion: descripcion,
                  precio: precio
              });
              console.log("Document written with ID: ", docRef.id);
              // Aquí podrías redirigir a otra página o mostrar un mensaje de éxito
          } catch (error) {
              console.error("Error adding document: ", error);
              // Aquí puedes manejar errores, como mostrar un mensaje de error al usuario
          }
      }
  });
}
