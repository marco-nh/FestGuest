import { app, storage } from "../../../firebase/initializeDatabase.js"; 
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js"; 

document.addEventListener('DOMContentLoaded', initialize);


let totalImagenes = 0;
let maxImagenes = 5

function initialize() {
    document.getElementById('subirImagenFigma').addEventListener('click', handleSubirImagen);
    agregarSugerencias('ciudad');
    agregarSugerencias('festivalName', 'festival-suggestions');
    agregarSugerencias('calle', 'street-suggestions');
    validacionFormulario();
}
document.addEventListener('DOMContentLoaded', initialize);


async function fetchPredictHQEvents(query) {
    const baseURL = "https://api.predicthq.com/v1/events";
    const ACCESS_TOKEN = "85teJJYm88B97rIg_7DrHPmAZxmSr4H_mAWggarF";
    const headers = {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Accept": "application/json"
    };
    const url = `${baseURL}?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, { headers: headers });
    return await response.json();
}
  
  
async function fetchSuggestions(query) {
    const response = await fetch(`https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=BsJ3AWQpgcXR8jiUM4E6AAYYgjNopDLy&limit=3&countrySet=ES`);
    return await response.json();
}



function displayPredictHQEvents(data, suggestionsPanel, input) {
    suggestionsPanel.innerHTML = '';
    data.results.forEach(result => {
      const div = document.createElement('div');
      div.innerHTML = result.title;
      div.classList.add('suggestion-item');
      div.addEventListener('click', function() {
        input.value = result.title;
        suggestionsPanel.innerHTML = '';
      });
      suggestionsPanel.appendChild(div);
    });
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
      if(inputId != "festivalName"){
      fetchSuggestions(query)
        .then(data => displaySuggestions(data, suggestionsPanel, input))
        .catch(error => console.log('Error:', error));
      if (inputId == 'calle'){
        getFestivalTransportReservation(query);
      }}else{
        fetchPredictHQEvents(query)
        .then(data => displayPredictHQEvents(data, suggestionsPanel, input))
        .catch(error => console.log('Error:', error));
      if (inputId == 'destino'){
        getFestivalTransportReservation(query);
        }
      }
    });
  }

function handleSubirImagen() {
    if (totalImagenes >= maxImagenes) {
        alert('No puedes subir más de 5 imágenes.');
        return;
    }
    document.getElementById('subirImagen').click();
}

document.getElementById('subirImagen').addEventListener('change', handleImagenChange);

function handleImagenChange() {
    const contenedorImagenes = document.getElementById('previewImagen');
    const archivos = this.files;
    const espacioRestante = maxImagenes - totalImagenes;
    const contadorImagen = Math.min(archivos.length, espacioRestante);

    for (let i = 0; i < contadorImagen; i++) {
        mostrarImagen(archivos[i], contenedorImagenes);
    }

    if (archivos.length > espacioRestante) {
        alert(`Solo puedes subir ${espacioRestante} más ${espacioRestante === 1 ? 'imagen' : 'imágenes'}.`);
    }
}

function mostrarImagen(file, contenedorImagenes) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('image-preview-wrapper');

        const img = document.createElement('img');
        img.src = e.target.result;
        img.classList.add('image-preview');

        const removeButton = document.createElement('div');
        removeButton.classList.add('remove-image');
        removeButton.textContent = 'X';
        removeButton.onclick = function() {
            contenedorImagenes.removeChild(imageWrapper);
            totalImagenes--; 
        };

        imageWrapper.appendChild(img);
        imageWrapper.appendChild(removeButton);
        contenedorImagenes.appendChild(imageWrapper);
        totalImagenes++; 
    };
    reader.readAsDataURL(file);
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

async function validacionFormulario() {
    document.getElementById('accomodationForm').addEventListener('submit', handleSubmitForm);
}

function handleSubmitForm(event) {
    event.preventDefault(); 

    const nombreAnuncioCasa = document.getElementById('nombreAnuncioCasa').value;
    const ciudad = document.getElementById('ciudad').value;
    const municipio = document.getElementById('municipio').value;
    const calle = document.getElementById('calle').value;
    const numeroHuespedesLibres = document.getElementById('numeroHuespedesLibres').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const totalImagenes = document.querySelectorAll('.image-preview-wrapper').length; 

    if (!nombreAnuncioCasa || !ciudad || !municipio || !calle || !numeroHuespedesLibres || !descripcion || !precio) {
        alert("All fields are required. Please fill out the entire form.");
        return;
    }

    if (descripcion.length < 20) { 
        alert("Description must be at least 20 characters long");
        return;
    }

    if (totalImagenes === 0) { 
        alert("At least 1 image must be uploaded");
        return;
    }

    subirImagenes();
}

async function subirImagenes() {
    const imageUrls = [];
    const files = document.getElementById('subirImagen').files;
    for (const file of files) {
        const imageName = file.name;
        const imageRef = ref(storage, 'images/accommodation' + imageName);
        try {
            await uploadBytes(imageRef, file);
            const url = await getDownloadURL(imageRef);
            imageUrls.push(url);
        } catch (error) {
            console.error("Error uploading image: ", error);
        }
    }

    guardarDatosFirestore(imageUrls);
}

function guardarDatosFirestore(imageUrls) {
    const nombreAnuncioCasa = document.getElementById('nombreAnuncioCasa').value;
    const ciudad = document.getElementById('ciudad').value;
    const municipio = document.getElementById('municipio').value;
    const calle = document.getElementById('calle').value;
    const numeroHuespedesLibres = document.getElementById('numeroHuespedesLibres').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;
    const festival = document.getElementById('festivalName').value;

    const db = getFirestore(app);

    const userDocString = localStorage.getItem('userDoc');
    if (userDocString) {
        const userDoc = JSON.parse(userDocString);            
        const userName = userDoc.userName;
        addDoc(collection(db, 'accommodations'), {
            nombreAnuncio: nombreAnuncioCasa,
            ciudad: ciudad,
            municipio: municipio,
            calle: calle,
            numeroHuespedesLibres: numeroHuespedesLibres,
            descripcion: descripcion,
            precio: precio,
            images: imageUrls,
            festivalAsociado: festival,
            usuario: userName
        }).then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        }).catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }
}
