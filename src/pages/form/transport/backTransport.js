// backTransport.js

import { app } from "../../../firebase/initializeDatabase.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
  agregarSugerencias('origen', 'origen-suggestions');
  agregarSugerencias('destino', 'destino-suggestions');
  validacionFormulario();
}

function agregarSugerencias(inputId, suggestionsId) {
  const input = document.getElementById(inputId);
  const suggestionsPanel = document.getElementById(suggestionsId);

  input.addEventListener('input', function() {
    const query = this.value;

    if (query.length < 3) {
      suggestionsPanel.innerHTML = '';
      return;
    }

    fetchSuggestions(query)
      .then(data => displaySuggestions(data, suggestionsPanel, input))
      .catch(error => console.log('Error:', error));
  });
}

function fetchSuggestions(query) {
  return fetch(`https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=BsJ3AWQpgcXR8jiUM4E6AAYYgjNopDLy&limit=3&countrySet=ES`)
    .then(response => response.json());
}

function displaySuggestions(data, suggestionsPanel, input) {
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
}

function validacionFormulario() {
  document.getElementById('rutaForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formValues = getFormValues();

    if (validateForm(formValues)) {
      await addTransportToFirestore(formValues);
    }
  });
}

function getFormValues() {
  return {
    nombreAnuncioCoche: document.getElementById('nombreAnuncioCoche').value,
    origen: document.getElementById('origen').value,
    destino: document.getElementById('destino').value,
    numeroAsientosLibres: document.getElementById('numeroAsientosLibres').value,
    descripcion: document.getElementById('descripcion').value,
    precio: document.getElementById('precio').value
  };
}

function validateForm(formValues) {
  if (!formValues.nombreAnuncioCoche || !formValues.origen || !formValues.destino || !formValues.numeroAsientosLibres || !formValues.descripcion || !formValues.precio) {
    alert("All fields are required. Please fill out the entire form.");
    return false;
  } else if (formValues.descripcion.length < 20) {
    alert("Description must be at least 20 characters long");
    return false;
  }
  return true;
}

async function addTransportToFirestore(formValues) {
  const db = getFirestore(app);
  try {
    const docRef = await addDoc(collection(db, 'transports'), formValues);
    console.log("Document written with ID: ", docRef.id);
    // Aquí podrías redirigir a otra página o mostrar un mensaje de éxito
  } catch (error) {
    console.error("Error adding document: ", error);
    // Aquí puedes manejar errores, como mostrar un mensaje de error al usuario
  }
}
