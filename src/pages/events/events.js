import { categoryImages } from "../../utils/category/category.js";
import { countries } from '../../pages/events/arrayPaises.js';
//DATABASE
import { app } from "../../firebase/initializeDatabase.js";
import { getDocs, query, where, getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

let eventos = [];

function initializeEvents() {
    setupSearch();
    handleSearch();
}
function handleSearch(event) {
    if (event) {
        event.preventDefault();
    }
    const city = document.getElementById('voice-search').value.trim();
    const country = document.getElementById('country').value;
    searchEvents(city, country);
}

function setupSearch() {
    const searchForm = document.getElementById('searchForm');
    const searchButton = document.getElementById('searchButton');

    searchForm.addEventListener('submit', handleSearch);
    searchButton.addEventListener('click', handleSearch);
}

function searchEvents(city, country) {
    const ACCESS_TOKEN = "jYkS1XaVpIN7oTCR0t2Tx9y4MmNENq4IzQ71mWCT";
    const baseURL = "https://api.predicthq.com/v1/events";
    const headers = {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Accept": "application/json"
    };
    let url = `${baseURL}?${encodeURIComponent(city)}`;

    const checkbox = document.getElementById('festival');
    const checkbox2 = document.getElementById('diaFestivo');
    const checkbox3 = document.getElementById('concierto');
    const checkbox4 = document.getElementById('sports');
    
    if (checkbox.checked) {
        url += 'category=festivals'
    }
    if (checkbox3.checked) {
        url += '%2Cconcerts'
    }
    if (checkbox2.checked) {
        url += '%2Cschool-holidays%2Cpublic-holidays'
    }
    if (checkbox4.checked) {
        url += '%2Csports'
    }

    if (country) {
        url += `&country=${encodeURIComponent(country)}`;
        url += `&limit=${encodeURIComponent(20)}`
    }

    const rankGrade = document.getElementById('rankGrade').value;

    if (rankGrade) {
        url += `&local_rank.gte=${encodeURIComponent(rankGrade)}`;
        console.log(rankGrade);
    }

    console.log(url)
    const loader = document.getElementById('loader');
    loader.style.display = 'flex'; 
    searchResults.innerHTML = '';
    fetch(url, { headers })
        .then(response => {
            console.log(response)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            eventos = data.results;
            renderEvents(eventos);
        })
        .catch(error => {
            console.error('Fetch error:', error);
            searchResults.innerHTML = '<p class="text-red-500 text-center py-4">An error occurred while fetching events.</p>';
        })
        .finally(() => {
            loader.style.display = 'none';
        });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function guardarEventoFirestore(evento) {
    const db = getFirestore(app);
    let querySnapshot;
    let checkExists = false
    
    // Los eventos son un array 2D, [0] es titulo, [1] es lugar
    // Esto se hace para facilitar vinculación (por el segundo metodo)

    if (localStorage.getItem('eventUpdated') == "false"){
        //Una operacion de busqueda, no debe de haber muchas!!
        querySnapshot = await getDocs(collection(db, "events"));

        localStorage.setItem('eventUpdated',"true")
        const eventos = new Array();
        querySnapshot.forEach((doc) => {
            eventos.push(new Array(doc.data().titulo,doc.data().localization.split('\n').join(' ')))
        })
        localStorage.setItem('events',JSON.stringify(eventos))
        querySnapshot = eventos
        console.log("Busqueda remota")
    } else{
        querySnapshot = JSON.parse(localStorage.getItem('events'))
        console.log("Busqueda local")
    }

    try {querySnapshot.forEach((doc) => {
        checkExists = doc[0].includes(evento.title);
        if (checkExists){
            throw BreakException
        }
    })} catch (e) {
        console.log("Fallo: Existe el evento en los datos")
        return false
    };


    await addDoc(collection(db, 'events'), {
        titulo: evento.title,
        fecha: `${new Date(evento.start).toLocaleDateString()}`,
        localization: getLocation(evento)
    }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    }).catch(function(error) {
        console.error("Error adding document: ", error);
    });

    //si añade uno nuevo, vuelve a cambiar la base de datos del conjunto de eventos
    localStorage.setItem('eventUpdated',"false")
}

function getRandomImageURL(category) {
    const baseURL = '/src/images/categoriesEvents/';

    if (category in categoryImages) {
        const crypto = window.crypto || window.Crypto;
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        const randomIndex = array[0] % categoryImages[category] + 1;
        const imageURL = `${baseURL}${category}/${randomIndex}.jpg`;
        return imageURL;
    } else {
        return 'https://via.placeholder.com/150';
    }
}

function renderEvents(events) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (events.length === 0) {
        searchResults.innerHTML = '<p class="text-gray-600 text-center py-4 border border-gray-300 rounded-md shadow-md bg-white p-6">No events found. Keep exploring!</p>';
        return;
    }

    const container = document.createElement('div');
    container.classList.add('grid', 'gap-4');

    events.forEach(evento => {
        const card = createEventCard(evento);
        if (card) {
            container.appendChild(card);
        }
    });

    searchResults.appendChild(container);
}


function createEventCard(evento) {
    let localization = getLocation(evento)
    if (!localization) {
        return null; 
    }

    const card = document.createElement('a');
    card.classList.add('flex', 'items-center', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow', 'hover:bg-gray-100', 'dark:border-gray-700', 'dark:bg-gray-800', 'dark:hover:bg-gray-700', 'hover:shadow-2xl', 'hover:contrast-125', 'transition-all', 'hover:scale-105');
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', openEventDetails);
    card.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            openEventDetails();
        }
    });

    async function openEventDetails() {
        const selectedEventData = {
            event: evento,
            imageURL: getRandomImageURL(evento.category)
        };
        localStorage.setItem('selectedEvent', JSON.stringify(selectedEventData));
        await guardarEventoFirestore(evento);
        window.location.href = `/src/pages/trip/trip.html?eventName=${encodeURIComponent(evento.title)}`;
    }
    card.addEventListener('mouseenter', () => {
        card.classList.add('transform', 'scale-100', 'shadow-lg');
    });

    card.addEventListener('mouseleave', () => {
        card.classList.remove('transform', 'scale-100', 'shadow-lg');
    });

    const imgContainer = document.createElement('div');
    imgContainer.classList.add('flex-shrink-0', 'h-48', 'w-48', 'rounded-l-lg', 'overflow-hidden');

    const img = document.createElement('img');
    img.classList.add('object-cover', 'w-full', 'h-full');
    img.src = getRandomImageURL(evento.category);
    img.alt = evento.title;

    imgContainer.appendChild(img);
    card.appendChild(imgContainer);

    const content = document.createElement('div');
    content.classList.add('flex', 'flex-col', 'p-4', 'flex-grow');

    const title = document.createElement('h5');
    title.classList.add('mb-2', 'text-xl', 'font-bold', 'text-gray-900', 'dark:text-white');
    title.textContent = evento.title;
    title.setAttribute('tabindex', '0');

    const dateLocation = document.createElement('p');
    dateLocation.classList.add('mb-1', 'text-sm', 'text-gray-600', 'dark:text-gray-400');
    dateLocation.textContent = `${new Date(evento.start).toLocaleDateString()} - ${localization}`;
    dateLocation.setAttribute('tabindex', '0');
    const description = document.createElement('p');
    description.classList.add('mb-3', 'text-sm', 'text-gray-700', 'dark:text-gray-400');
    description.setAttribute('tabindex', '0');

    const cleanedDescription = evento.description.replace(/^Sourced from predicthq\.com\s* -/, '');
    const shortenedDescription = shortenDescription(cleanedDescription)

    description.textContent = shortenedDescription.replace(/^Sourced from predicthq\.com\s*/, '');

    content.appendChild(title);
    content.appendChild(dateLocation);
    content.appendChild(description);
    card.appendChild(content);

    return card;
}

function shortenDescription(description, maxLines = 4, maxWords = 40) {
    const descriptionLines = description.split('\n');
    const cleanedDescription = description.replace(/\n/g, ' ');
    
    let shortenedDescription;
  
    if (descriptionLines.length > maxLines) {
      shortenedDescription = descriptionLines.slice(0, maxLines - 1).join('\n\n') + '...';
    } else {
      const wordCount = cleanedDescription.split(' ').length;
      if (wordCount > maxWords) {
        shortenedDescription = cleanedDescription.split(' ').slice(0, maxWords - 1).join(' ') + '...';
      } else {
        shortenedDescription = cleanedDescription;
      }
    }
  
    return shortenedDescription;
  }


function getLocation(event) {
    let locationString = '';
    if (event.entities && event.entities.length > 0) {
        const venue = event.entities[0];
        if (venue.formatted_address) {
            locationString = venue.formatted_address;
        } else {
            if (event.location) {
                locationString = event.location;
            }
            if (event.locality) {
                locationString += `, ${event.locality}`;
            }
            if (event.country) {
                locationString += `, ${event.country}`;
            }
        }
    }
    return locationString;
}

document.addEventListener('DOMContentLoaded', function() {

    const selectElement = document.getElementById('country');

    countries .forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = country.name;
        selectElement.appendChild(option);
    });
});

document.addEventListener('DOMContentLoaded', initializeEvents);
