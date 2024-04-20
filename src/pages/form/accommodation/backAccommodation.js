import { app, storage } from "../../../firebase/initializeDatabase.js"; 
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js"; 

document.addEventListener('DOMContentLoaded', (event) => {
    let totalImagenes = 0; 
    let maxImagenes = 5;

    document.getElementById('subirImagenFigma').addEventListener('click', function() {
        
        if (totalImagenes >= maxImagenes) {
            alert('No puedes subir más de 5 imágenes.');
            return;
        }
        document.getElementById('subirImagen').click();
    });

    document.getElementById('subirImagen').addEventListener('change', function() {
        let contenedorImagenes = document.getElementById('previewImagen');
        
        let archivos = this.files;
        
        let espacioRestante = maxImagenes - totalImagenes;
        let contadorImagen = Math.min(archivos.length, espacioRestante);

        
        for (let i = 0; i < contadorImagen; i++) {
            (function(file) {
                let reader = new FileReader();
                reader.onload = function(e) {
                    let imageWrapper = document.createElement('div');
                    imageWrapper.classList.add('image-preview-wrapper');

                    let img = document.createElement('img');
                    img.src = e.target.result;
                    img.classList.add('image-preview');

                    let removeButton = document.createElement('div');
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
            })(archivos[i]);
        }

        
        if(archivos.length > espacioRestante) {
            alert(`Solo puedes subir ${espacioRestante} más ${espacioRestante === 1 ? 'imagen' : 'imágenes'}.`);
        }
    });


    validacionFormulario();
});

async function validacionFormulario() {
    document.getElementById('accomodationForm').addEventListener('submit', async function(event) {
        event.preventDefault(); 

        let nombreAnuncioCasa = document.getElementById('nombreAnuncioCasa').value;
        let ciudad = document.getElementById('ciudad').value;
        let municipio = document.getElementById('municipio').value;
        let calle = document.getElementById('calle').value;
        let numeroHuespedesLibres = document.getElementById('numeroHuespedesLibres').value;
        let descripcion = document.getElementById('descripcion').value;
        let precio = document.getElementById('precio').value;
        let totalImagenes = document.querySelectorAll('.image-preview-wrapper').length; 

        if (!nombreAnuncioCasa || !ciudad || !municipio || !calle || !numeroHuespedesLibres || !descripcion || !precio) {
            alert("All fields are required. Please fill out the entire form.");
        } else if (descripcion.length < 20) { 
            alert("Description must be at least 20 characters long");
        } else if (totalImagenes === 0) { 
            alert("At least 1 image must be uploaded");
        } else {
            const imageUrls = []; // Para almacenar los URLs de las imágenes
            const files = document.getElementById('subirImagen').files;
            for (const file of files) {
                const imageName = file.name;
                const imageRef = ref(storage, 'images/accommodation' + imageName);
                try {
                    await uploadBytes(imageRef, file);
                    // Obtener el URL de la imagen subida
                    const url = await getDownloadURL(imageRef);
                    imageUrls.push(url); // Guardar el URL en el array
                } catch (error) {
                    console.error("Error uploading image: ", error);
                    // Aquí puedes manejar errores de carga de imágenes
                }
            }

            // Guardar datos en Firestore junto con las referencias de las imágenes
            const db = getFirestore(app);
            addDoc(collection(db, 'accommodations'), {
                nombreAnuncio: nombreAnuncioCasa,
                ciudad: ciudad,
                municipio: municipio,
                calle: calle,
                numeroHuespedesLibres: numeroHuespedesLibres,
                descripcion: descripcion,
                precio: precio,
                images: imageUrls // Guardar los URLs en el documento Firestore
            }).then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
                // Aquí podrías redirigir a otra página o mostrar un mensaje de éxito
            }).catch(function(error) {
                console.error("Error adding document: ", error);
                // Aquí puedes manejar errores, como mostrar un mensaje de error al usuario
            });
        }
    });
}
