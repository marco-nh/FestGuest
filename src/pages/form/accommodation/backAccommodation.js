import { app, storage } from "../../../firebase/initializeDatabase.js"; 
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js"; 

document.addEventListener('DOMContentLoaded', initialize);


let totalImagenes = 0;
let maxImagenes = 5

function initialize() {
    document.getElementById('subirImagenFigma').addEventListener('click', handleSubirImagen);

    validacionFormulario();
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

    const db = getFirestore(app);
    addDoc(collection(db, 'accommodations'), {
        nombreAnuncio: nombreAnuncioCasa,
        ciudad: ciudad,
        municipio: municipio,
        calle: calle,
        numeroHuespedesLibres: numeroHuespedesLibres,
        descripcion: descripcion,
        precio: precio,
        images: imageUrls
    }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    }).catch(function(error) {
        console.error("Error adding document: ", error);
    });
}
