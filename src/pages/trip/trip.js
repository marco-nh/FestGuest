
// Nuevo código para mostrar información específica del evento
document.addEventListener('DOMContentLoaded', async function() {
    // Obtener la información del evento del localStorage
    const storedEvent = JSON.parse(localStorage.getItem('selectedEvent'));
    const infoEvent = storedEvent.event;
    
    // Obtener el botón de transporte y añadirle un evento de click
    const transportButton = document.getElementById('transportButton');
    transportButton.addEventListener('click', function() {
        // Llamar a la función para obtener transportes
        
    });

    // Obtener el botón de Alojamiento y añadirle un evento de click
    const accommodationsButton = document.getElementById('accommodationsButton');
    accommodationsButton.addEventListener('click', function() {
        // Llamar a la función para obtener alojamientos
    });
    // Verificar si hay información almacenada
    if (storedEvent) {
        // Obtener los elementos del DOM para llenar con la información del evento
        const eventNameElement = document.getElementById('eventName');
        const eventImageElement = document.getElementById('eventImage');
        const eventStartElement = document.getElementById('eventStart');
        const eventEndElement = document.getElementById('eventEnd');
        const eventUpdatedElement = document.getElementById('eventUpdated');
        const eventCountryElement = document.getElementById('eventCountry');
        const eventLocationElement = document.getElementById('eventLocation');
        
        // Llenar los elementos con la información del evento
        eventNameElement.textContent = infoEvent.title;
        eventImageElement.src = storedEvent.imageURL;
        eventStartElement.textContent = `Start Date: ${new Date(infoEvent.start).toLocaleDateString()}`;
        eventEndElement.textContent = `End Date: ${new Date(infoEvent.end).toLocaleDateString()}`;
        eventUpdatedElement.textContent = `Updated: ${new Date(infoEvent.updated).toLocaleDateString()}`;
        eventCountryElement.textContent = `Country: ${infoEvent.country}`;
        
        if(storedEvent.event)
        // Obtener la ubicación de forma asíncrona
        try {
            const location = await getLocationFromAPI(storedEvent.event); // Cambio de nombre aquí
            eventLocationElement.textContent = `Location: ${location}`;
        } catch (error) {
            console.error('Error al obtener la ubicación:', error);
        }
    }
});

// Función para obtener la ubicación utilizando la API de TomTom
async function getLocationFromAPI(event) { // Cambio de nombre aquí
    let locationString = '';

    // Verificar si hay información de ubicación en 'entities'
    if (event.entities && event.entities.length > 0) {
        const venue = event.entities[0];

        // Si hay una dirección formateada, mostrarla
        if (venue.formatted_address) {
            locationString = venue.formatted_address;
            console.log("Cogio la local");
        }
    }

    // Si no hay una dirección formateada, obtener la dirección utilizando la API de TomTom
    if (!locationString && event.location && event.location.length === 2) {
        const [latitude, longitude] = event.location;

        try {
            const response = await fetch(`https://api.tomtom.com/search/2/reverseGeocode/crossStreet/${longitude}%2C${latitude}.json?limit=1&radius=10000&allowFreeformNewLine=false&view=Unified&key=BsJ3AWQpgcXR8jiUM4E6AAYYgjNopDLy&limit=1`);
            const data = await response.json();
            console.log("Cogio la remota");
            // Verificar si se obtuvo una dirección válida desde la API de TomTom
            if (data && data.addresses && data.addresses.length > 0) {
                const address = data.addresses[0].address;
                // Construir la cadena de ubicación utilizando la dirección obtenida
                locationString = `${address.streetName}, ${address.municipality}, ${address.country}`;
            }
        } catch (error) {
            console.error('Error al obtener la dirección desde la API de TomTom:', error);
        }
    }

    return locationString;
}