document.addEventListener('DOMContentLoaded', function() {
    const storedEvent = JSON.parse(localStorage.getItem('selectedEvent'));
    const infoEvent = storedEvent.event;
    
    const transportButton = document.getElementById('transportButton');
    transportButton.addEventListener('click', function() {
        // Pendiente implementar Buscar los transportes relacionados con el evento(Revisar local storage)        
    });


    const accommodationsButton = document.getElementById('accommodationsButton');
    accommodationsButton.addEventListener('click', function() {
        // Pendiente implementar Buscar las acomodaciones relacionados con el evento(Revisar local storage)
    });

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
                })
                .catch(error => {
                    console.error('Error al obtener la ubicación:', error);
                });
        }
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