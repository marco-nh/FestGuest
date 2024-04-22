document.addEventListener('DOMContentLoaded', function() {
    // Obtener la información del evento del localStorage
    const storedEvent = JSON.parse(localStorage.getItem('selectedEvent'));
    console.log(storedEvent)
    // Verificar si hay información almacenada
    if (storedEvent) {
        // Obtener los elementos del DOM para llenar con la información del evento
        const eventNameElement = document.getElementById('eventName');
        const eventLocationElement = document.getElementById('eventLocation');
        const eventDateElement = document.getElementById('eventDate');
        const eventTimeElement = document.getElementById('eventTime');

        // Llenar los elementos con la información del evento
        eventNameElement.textContent = storedEvent.title;
        eventLocationElement.textContent = `Location: ${getLocation(storedEvent.event)}`;
        eventDateElement.textContent = `Date: ${new Date(storedEvent.start).toLocaleDateString()}`;
        eventTimeElement.textContent = `Time: ${new Date(storedEvent.start).toLocaleTimeString()}`;
    }
});

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

// Nuevo código para mostrar información específica del evento
document.addEventListener('DOMContentLoaded', function() {
    // Obtener la información del evento del localStorage
    const storedEvent = JSON.parse(localStorage.getItem('selectedEvent'));
    const infoEvent = storedEvent.event;
    console.log(infoEvent)
    // Verificar si hay información almacenada
    if (storedEvent) {
        // Obtener los elementos del DOM para llenar con la información del evento
        const eventNameElement = document.getElementById('eventName');
        const eventImageElement = document.getElementById('eventImage');
        const eventStartElement = document.getElementById('eventStart');
        const eventEndElement = document.getElementById('eventEnd');
        const eventUpdatedElement = document.getElementById('eventUpdated');
        const eventCountryElement = document.getElementById('eventCountry');

        // Llenar los elementos con la información del evento
        eventNameElement.textContent = infoEvent.title;
        eventImageElement.src = storedEvent.imageURL;
        eventStartElement.textContent = `Start Date: ${new Date(infoEvent.start).toLocaleDateString()}`;
        eventEndElement.textContent = `End Date: ${new Date(infoEvent.end).toLocaleDateString()}`;
        eventUpdatedElement.textContent = `Updated: ${new Date(infoEvent.updated).toLocaleDateString()}`;
        eventCountryElement.textContent = `Country: ${infoEvent.country}`;
    }
});
