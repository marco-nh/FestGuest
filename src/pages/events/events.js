import { categoryImages } from "../../utils/category/category.js";
import { countries } from '../../pages/events/arrayPaises.js';
import { app } from "../../firebase/initializeDatabase.js";
import { getDocs, getFirestore, collection, addDoc} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getLocationByCords } from "../../utils/location/getLocation.js";

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
    const ACCESS_TOKEN = "KehcazRA-OcKZdoahdjRHouWqb1emiCBYGgIjZvc";
    const headers = {
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Accept": "application/json"
    };

    let url = buildUrl(city, country);

    const loader = document.getElementById('loader');
    loader.style.display = 'flex'; 
    searchResults.innerHTML = '';

    fetch(url, { headers })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const eventos = data.results;
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

function buildUrl(city, country) {
    const baseURL = "https://api.predicthq.com/v1/events";
    let url = `${baseURL}?q=${encodeURIComponent(city)}`;

    const minAsist = document.getElementById('asistencia_minima').value;
    const maxAsist = document.getElementById('asistencia_maxima').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const minRankGrade = document.getElementById('minRankGrade').value;
    const maxRankGrade = document.getElementById('maxRankGrade').value;

    if (minAsist) url += `&phq_attendance.gt=${encodeURIComponent(minAsist)}`;
    if (maxAsist) url += `&phq_attendance.lt=${encodeURIComponent(maxAsist)}`;
    if (startDate) url += `&active.gte=${encodeURIComponent(startDate)}`;
    if (endDate) url += `&active.lte=${encodeURIComponent(endDate)}`;
    if (country) url += `&country=${encodeURIComponent(country)}`;
    if (minRankGrade) url += `&local_rank.gte=${encodeURIComponent(minRankGrade)}`;
    if (maxRankGrade) url += `&local_rank.lte=${encodeURIComponent(maxRankGrade)}`;
    if (startDate && endDate && minAsist) url += `&sort=phq_attendance,-start`;

    const categories = getCategories();
    if (categories.length > 0) url += `&category=${categories.join('%2C')}`;

    return url;
}

function getCategories() {
    const categories = [];
    const categoryMapping = {
        festival: 'festivals',
        concierto: 'concerts',
        diaFestivo: ['school-holidays', 'public-holidays'],
        sports: 'sports',
        community: 'community',
        conferences: 'conferences',
        expos: 'expos',
        arts: 'performing-arts'
    };

    for (const [key, value] of Object.entries(categoryMapping)) {
        const element = document.getElementById(key);
        if (element) {
            if (Array.isArray(value)) {
                categories.push(...value);
            } else {
                categories.push(value);
            }
        }
    }

    return categories;
}

async function saveEventFirestore(evento) {
    const db = getFirestore(app);
    let querySnapshot;
    let checkExists = false

    if (localStorage.getItem('eventUpdated') == "false"){
        querySnapshot = await getDocs(collection(db, "events"));

        localStorage.setItem('eventUpdated',"true")
        const eventos = new Array();
        querySnapshot.forEach((doc) => {
            eventos.push(new Array(doc.data().titulo,doc.data().localization.split('\n').join(' ')))
        })
        localStorage.setItem('events',JSON.stringify(eventos))
        querySnapshot = eventos
    } else{
        querySnapshot = JSON.parse(localStorage.getItem('events'))
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
    let eventRealLocation = await getLocation(evento);

    await addDoc(collection(db, 'events'), {
        titulo: evento.title,
        fecha: `${new Date(evento.start).toLocaleDateString()}`,
        localization: eventRealLocation
    }).then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    }).catch(function(error) {
        console.error("Error adding document: ", error);
    });

    //si añade uno nuevo, vuelve a cambiar la base de datos del conjunto de eventos
    localStorage.setItem('eventUpdated',"false")
}

function getRandomImageURL(category) {
    const baseURL = './../../../src/images/categoriesEvents/';

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

async function renderEvents(events) {
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (events.length === 0) {
        searchResults.innerHTML = '<p class="text-gray-600 text-center py-4 border border-gray-300 rounded-md shadow-md bg-white p-6">No events found. Keep exploring!</p>';
        return;
    }

    const container = document.createElement('div');
    container.classList.add('grid', 'gap-4');

    events.forEach(async evento => {
        const card = await createEventCard(evento);
        if (card) {
            container.appendChild(card);
        }
    });

    searchResults.appendChild(container);
}


async function createEventCard(evento) {
    let localization = await getLocation(evento)
    if (!localization) {
        return null; 
    }

    const card = document.createElement('a');
    card.classList.add('flex', 'items-center',"card-hover-no-underline", 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow', 'hover:bg-gray-100', 'dark:border-gray-700', 'dark:bg-gray-800', 'dark:hover:bg-gray-700', 'hover:shadow-2xl', 'hover:contrast-125', 'transition-all', 'hover:scale-105');
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
        await saveEventFirestore(evento);
        window.location.href = `./../../../src/pages/trip/trip.html?eventName=${encodeURIComponent(evento.title)}`;
    }
    card.addEventListener('mouseenter', () => {
        card.classList.add('transform', 'scale-100', 'shadow-lg',"text-deco");
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
    content.classList.add('flex', 'flex-col', 'p-4', 'flex-grow',);

    const title = document.createElement('h5');
    title.classList.add('mb-2', 'text-xl', 'font-bold','text-gray-900', 'dark:text-white');
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

  async function getLocation(event) {
    if (!event.entities || event.entities.length === 0) {
        return '';
    }

    const venue = event.entities[0];
    if (venue.formatted_address) {
        return venue.formatted_address;
    }

    return await buildLocationString(event);
}

async function buildLocationString(event) {
    let locationString = '';

    if (event.location) {
        locationString = await addLocationByCoords(event, locationString);
    }
    locationString = addLocalityAndCountry(event, locationString);

    return locationString;
}

async function addLocationByCoords(event, locationString) {
    try {
        const locate = await getLocationByCords(event);
        return `${locationString} ${locate}`;
    } catch (error) {
        console.error('Error al obtener la ubicación:', error);
        return locationString;
    }
}

function addLocalityAndCountry(event, locationString) {
    if (event.locality) {
        locationString += `, ${event.locality}`;
    }
    if (event.country) {
        locationString += `, ${event.country}`;
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

        function toggleDateRange() {
            let dateRange = document.getElementById("dateRange");
            if (dateRange.style.display === "none" || dateRange.style.display === "") {
                dateRange.style.display = "block";
            } else {
                dateRange.style.display = "none";
            }
        }

        function toggleAttendance() {
            let dropdown = document.getElementById("dropdown");
            if (dropdown.style.display === "none" || dropdown.style.display === "") {
                dropdown.style.display = "block";
            } else {
                dropdown.style.display = "none";
            }
        }
    
        document.getElementById("toggleDateRangeButton").addEventListener("click", toggleDateRange);
    
        document.getElementById("toggleAttendanceButton").addEventListener("click", toggleAttendance);
    
});


document.addEventListener('DOMContentLoaded', initializeEvents);
