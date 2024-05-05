export async function getLocationByCords(event) {
    let locationString = '';

    if (event.entities && event.entities.length > 0) {
        const venue = event.entities[0];
        if (venue.formatted_address) {
            locationString = venue.formatted_address;
        }
    }

    if (!locationString && event.location && event.location.length === 2) {
        const [latitude, longitude] = event.location;

        try {
            const response = await fetch(`https://api.tomtom.com/search/2/reverseGeocode/crossStreet/${longitude}%2C${latitude}.json?limit=1&radius=10000&allowFreeformNewLine=false&view=Unified&key=BsJ3AWQpgcXR8jiUM4E6AAYYgjNopDLy&limit=1`);
            const data = await response.json();
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


