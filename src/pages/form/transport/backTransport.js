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
      cleanFestivalReservation()
      suggestionsPanel.innerHTML = '';
      return;
    }
    fetchSuggestions(query)
      .then(data => displaySuggestions(data, suggestionsPanel, input))
      .catch(error => console.log('Error:', error));
    if (inputId == 'destino'){
      getFestivalTransportReservation(query);
    }
  });
}

async function fetchSuggestions(query) {
  const response = await fetch(`https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=BsJ3AWQpgcXR8jiUM4E6AAYYgjNopDLy&limit=3`);
  return await response.json();
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
  document.getElementById('rutaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    handleSubmit(event); // Call an async function inside here if needed
  });
}

async function handleSubmit(event) {
  const formValues = getFormValues();
  if (validateForm(formValues)) {
    try {
      await addTransportToFirestore(formValues);
    } catch (error) {
      console.error("Error adding transport: ", error);
    }
  }
}

function getFestivalTransportReservation(query){
  const festivalForm = document.getElementById("festivalName")
  const festivales = JSON.parse(localStorage.getItem('events'))
  if (festivales != null){
    festivales.forEach((fes) => {
      console.log(fes[1],query)
      if (fes[1].includes(query)){
        const festival = document.createElement('option');
        festival.textContent = fes[0];
        festival.value = fes[0];
        festival.setAttribute("id", fes[0])
        if (document.getElementById(fes[0]) == null){
          festivalForm.appendChild(festival)
        }
      } 
    })
  }
}

function cleanFestivalReservation(){
  const festivalForm = document.getElementById("festivalName")
  festivalForm.textContent = ""
}

function getFormValues() {
  const userDocString = localStorage.getItem('userDoc');
  if (userDocString) {
    const userDoc = JSON.parse(userDocString);            
    const userName = userDoc.userName;
    console.log(userName)
    return {
      nombreAnuncioCoche: document.getElementById('nombreAnuncioCoche').value,
      origen: document.getElementById('origen').value,
      destino: document.getElementById('destino').value,
      numeroAsientosLibres: document.getElementById('numeroAsientosLibres').value,
      descripcion: document.getElementById('descripcion').value,
      precio: document.getElementById('precio').value,
      festivalAsociado: document.getElementById('festivalName').value,
      usuario: userName
    };
  } else {
    return false 
  }

  
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
    window.location.href = '/src/index.html'
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}
