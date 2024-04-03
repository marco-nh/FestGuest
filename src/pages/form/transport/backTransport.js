//Faltaria todo lo que tiene que ver con firebase: tanto el verificar que los usuarios registrados pueden entrar a esta url
//como que al submitear el formulario se envie a la base de datos

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


function validacionFormulario(){
  document.getElementById('rutaForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    
    var nombreAnuncioCoche = document.getElementById('nombreAnuncioCoche').value;
    var origen = document.getElementById('origen').value;
    var destino = document.getElementById('destino').value;
    var numeroAsientosLibres = document.getElementById('numeroAsientosLibres').value;
    var descripcion = document.getElementById('descripcion').value;
    var precio = document.getElementById('precio').value;

    
    if (!nombreAnuncioCoche || !origen || !destino || !numeroAsientosLibres || !descripcion || !precio) {
        
        alert("All fields are required. Please fill out the entire form.");
    } else if(descripcion.length < 20){
        alert("Description must be at least 20 characters long")
    }else{
        
        this.submit();
    }
});
}
