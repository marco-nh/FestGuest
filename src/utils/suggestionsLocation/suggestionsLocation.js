
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


export {fetchPredictHQEvents, fetchSuggestions, displayPredictHQEvents}