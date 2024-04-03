document.addEventListener('DOMContentLoaded', (event) => {

   
    agregarSugerencias('origen', 'origen-suggestions');
    agregarSugerencias('destino', 'destino-suggestions');
    
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


