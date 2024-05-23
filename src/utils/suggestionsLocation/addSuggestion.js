import { fetchPredictHQEvents, displayPredictHQEvents, fetchSuggestions } from "./suggestionsLocation.js";
import { getFestivalTransportReservation, cleanFestivalReservation } from "./getFestival.js";

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


  export { agregarSugerencias, displaySuggestions }