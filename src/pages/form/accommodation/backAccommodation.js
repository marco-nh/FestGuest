import { app, storage } from "/src/firebase/initializeDatabase.js"; // Importa la instancia de Firebase desde initializeDatabase.js
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js"; // Importa las funciones necesarias de Firestore
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-storage.js"; // Importa las funciones necesarias de Firebase Storage

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

        
        for (var i = 0; i < contadorImagen; i++) {
            (function(file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var imageWrapper = document.createElement('div');
                    imageWrapper.classList.add('image-preview-wrapper');

                    var img = document.createElement('img');
                    img.src = e.target.result;
                    img.classList.add('image-preview');

                    var removeButton = document.createElement('div');
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

        var nombreAnuncioCasa = document.getElementById('nombreAnuncioCasa').value;
        var ciudad = document.getElementById('ciudad').value;
        var municipio = document.getElementById('municipio').value;
        var calle = document.getElementById('calle').value;
        var numeroHuespedesLibres = document.getElementById('numeroHuespedesLibres').value;
        var descripcion = document.getElementById('descripcion').value;
        var precio = document.getElementById('precio').value;
        var totalImagenes = document.querySelectorAll('.image-preview-wrapper').length; 

        if (!nombreAnuncioCasa || !ciudad || !municipio || !calle || !numeroHuespedesLibres || !descripcion || !precio) {
            alert("All fields are required. Please fill out the entire form.");
        } else if (descripcion.length < 20) { 
            alert("Description must be at least 20 characters long");
        } else if (totalImagenes === 0) { 
            alert("At least 1 image must be uploaded");
        } else {
            // Subir imágenes a Storage
            const imageRefs = [];
            const imageUrls = []; // Para almacenar los URLs de las imágenes
            const files = document.getElementById('subirImagen').files;
            for (const file of files) {
                const imageName = file.name;
                const imageRef = ref(storage, 'images/accommodation' + imageName);
                try {
                    await uploadBytes(imageRef, file);
                    imageRefs.push(imageRef);
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
