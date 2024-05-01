//firebase
import { app } from "../../firebase/initializeDatabase.js";
import { getDocs, getFirestore, collection} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

function initiateRender(){

}
async function getTransport(container,location){
    const db = getFirestore(app);
    const querySnapshot = await getDocs(collection(db, "transports"));
    let checkExists = false
    querySnapshot.forEach((doc) => {
            const regexMatch = location.substring(0,location.indexOf("\n")).match('[a-zA-Z]{2}.+')
            checkExists = doc.data().destino.includes(regexMatch);
            console.log(regexMatch)
            if (checkExists){
                const card = createTransportCard(doc.data())
                container.appendChild(card)
            }
        })
}
function renderTransport(location){
    const base = document.getElementById("base")

    const container = document.createElement('div');
    container.classList.add('grid', 'gap-4');

    getTransport(container,location)

    base.appendChild(container);
}
function createTransportCard(datos) {
    const card = document.createElement('p');
    card.classList.add('flex', 'items-center', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow', 'hover:bg-gray-100', 'dark:border-gray-700', 'dark:bg-gray-800', 'dark:hover:bg-gray-700', 'hover:shadow-2xl', 'hover:contrast-125', 'transition-all', 'hover:scale-105');
    card.setAttribute('tabindex', '0');
    /*
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('flex-shrink-0', 'h-48', 'w-48', 'rounded-l-lg', 'overflow-hidden');
    const img = document.createElement('img');
    img.classList.add('object-cover', 'w-full', 'h-full');
    img.src = getRandomImageURL(evento.category);
    img.alt = evento.title;

    imgContainer.appendChild(img);
    card.appendChild(imgContainer);
    */
    const content = document.createElement('div');
    content.classList.add('flex', 'flex-col', 'p-4');

    const divider = document.createElement('div');
    divider.classList.add('flex', 'flex-row', 'p-4','flex-wrap');
  
    const username = document.createElement('h4');
    username.classList.add('mb-2','px-1','text-xl', 'font-bold', 'text-gray-900', 'dark:text-white');
    username.textContent = datos.usuario;
    username.setAttribute('tabindex', '0');

    const img = document.createElement('img');
    img.classList.add("w-10");
    img.setAttribute('src', '/src/images/icon-chat.png');
    img.setAttribute('tabindex', '0');
    username.appendChild(img)

    const title = document.createElement('h5');
    title.classList.add('mb-2', 'px-2','text-xl', 'font-bold', 'text-gray-900', 'dark:text-white', "object-fit-fill");
    title.textContent = datos.nombreAnuncioCoche;
    title.setAttribute('tabindex', '0');

    const descripcion = document.createElement('p');
    descripcion.classList.add('mb-1', 'text-sm', 'text-gray-600', 'dark:text-gray-400');
    descripcion.textContent = datos.descripcion;
    descripcion.setAttribute('tabindex', '0');

    divider.appendChild(title);
    divider.appendChild(username);
    content.appendChild(divider)
    content.appendChild(descripcion);
    card.appendChild(content);

    return card;
}

document.addEventListener('DOMContentLoaded', function() {
    const storedEvent = JSON.parse(localStorage.getItem('selectedEvent'));
    const infoEvent = storedEvent.event;

    if (storedEvent) {
        const eventNameElement = document.getElementById('eventName');
        const eventImageElement = document.getElementById('eventImage');
        const eventStartElement = document.getElementById('eventStart');
        const eventEndElement = document.getElementById('eventEnd');
        const eventUpdatedElement = document.getElementById('eventUpdated');
        const eventCountryElement = document.getElementById('eventCountry');
        const eventLocationElement = document.getElementById('eventLocation');
        
        eventNameElement.textContent = infoEvent.title;
        eventImageElement.src = storedEvent.imageURL;
        eventStartElement.textContent = `Start Date: ${new Date(infoEvent.start).toLocaleDateString()}`;
        eventEndElement.textContent = `End Date: ${new Date(infoEvent.end).toLocaleDateString()}`;
        eventUpdatedElement.textContent = `Updated: ${new Date(infoEvent.updated).toLocaleDateString()}`;
        eventCountryElement.textContent = `Country: ${infoEvent.country}`;
        
        if(storedEvent.event) {
            getLocationFromAPI(storedEvent.event)
                .then(location => {
                    eventLocationElement.textContent = `Location: ${location}`;
                    renderTransport(location)
                })
                .catch(error => {
                    console.error('Error al obtener la ubicación:', error);
                });
        }
        const transportButton = document.getElementById('transportButton');
        transportButton.addEventListener('click', function() {
            // Pendiente implementar Buscar los transportes relacionados con el evento(Revisar local storage)
            const transportContent = document.getElementById('content')
            transportContent.classList.remove('hidden')
        });


        const accommodationsButton = document.getElementById('accommodationsButton');
        accommodationsButton.addEventListener('click', function() {
            // Pendiente implementar Buscar las acomodaciones relacionados con el evento(Revisar local storage)
        });
    }

    
        
});

import { createChat } from "../chat/chat.js";

document.getElementById('chatBoton').addEventListener('click', function(){
    const storedEvent = JSON.parse(localStorage.getItem('selectedEvent'));
    const infoEvent = storedEvent.event;
    const nombre = infoEvent.title;
    createChat(nombre);
    window.location.href = `/src/pages/chat/chat.html?chatName=${nombre}`
});



async function getLocationFromAPI(event) {
    let locationString = '';

    if (event.entities && event.entities.length > 0) {
        const venue = event.entities[0];
        if (venue.formatted_address) {
            locationString = venue.formatted_address;
            console.log("Cogio la local");
        }
    }

    if (!locationString && event.location && event.location.length === 2) {
        const [latitude, longitude] = event.location;

        try {
            const response = await fetch(`https://api.tomtom.com/search/2/reverseGeocode/crossStreet/${longitude}%2C${latitude}.json?limit=1&radius=10000&allowFreeformNewLine=false&view=Unified&key=BsJ3AWQpgcXR8jiUM4E6AAYYgjNopDLy&limit=1`);
            const data = await response.json();
            console.log("Cogio la remota");
            if (data?.addresses?.length > 0) {
                const address = data.addresses[0].address;
                locationString = `${address.streetName}, ${address.municipality}, ${address.country}`;
            }
        } catch (error) {
            console.error('Error al obtener la dirección desde la API de TomTom:', error);
        }
    }

    return locationString;
}