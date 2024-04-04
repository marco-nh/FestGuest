document.addEventListener('DOMContentLoaded', (event) => {
    var totalImagenes = 0; 
    var maxImagenes = 5;

    document.getElementById('subirImagenFigma').addEventListener('click', function() {
        
        if (totalImagenes >= maxImagenes) {
            alert('No puedes subir más de 5 imágenes.');
            return;
        }
        document.getElementById('subirImagen').click();
    });

    document.getElementById('subirImagen').addEventListener('change', function() {
        var contenedorImagenes = document.getElementById('previewImagen');
        
        var archivos = this.files;
        
        var espacioRestante = maxImagenes - totalImagenes;
        var contadorImagen = Math.min(archivos.length, espacioRestante);

        
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



function validacionFormulario() {
    document.getElementById('accomodationForm').addEventListener('submit', function(event) {
        event.preventDefault(); 

        var nombreAnuncioCasa = document.getElementById('nombreAnuncioCasa').value;
        var numeroHuespedesLibres = document.getElementById('numeroHuespedesLibres').value;
        var descripcion = document.getElementById('descripcion').value;
        var precio = document.getElementById('precio').value;
        var totalImagenes = document.querySelectorAll('.image-preview-wrapper').length; 

        
        if (!nombreAnuncioCasa || !numeroHuespedesLibres || !descripcion || !precio) {
            alert("All fields are required. Please fill out the entire form.");
        } else if (descripcion.length < 20) { 
            alert("Description must be at least 20 characters long");
        } else if (totalImagenes === 0) { 
            alert("Must be uploaded 1 image");
        } else {
            this.submit();
        }
    });
}