let eventos = [];

function initializeEvents() {
    fetch('/src/events.json')
        .then(response => response.json())
        .then(data => {
            eventos = data.eventos;
            setupSearch();
            handleSearch(); // Call handleSearch when events are loaded
        })
        .catch(error => console.error('Error loading events:', error));

    // Define handleSearch function outside of setupSearch
    function handleSearch(event) {
        if (event) {
            event.preventDefault();
        }
        const voiceSearchInput = document.getElementById('voice-search');
        const searchTerm = voiceSearchInput.value.toLowerCase().trim();
        const filteredEvents = filterEvents(searchTerm);
        renderEvents(filteredEvents);
    }

    function setupSearch() {
        const searchForm = document.getElementById('searchForm');
        const searchButton = document.getElementById('searchButton');

        searchForm.addEventListener('submit', handleSearch);
        searchButton.addEventListener('click', handleSearch);
    }

    function filterEvents(searchTerm) {
        return eventos.filter(evento =>
            evento.nombre.toLowerCase().includes(searchTerm) ||
            evento.ubicacion.ciudad.toLowerCase().includes(searchTerm)
        );
    }

    function renderEvents(events) {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';

        if (events.length === 0) {
            searchResults.innerHTML = '<p class="text-gray-600 text-center py-4 border border-gray-300 rounded-md shadow-md bg-white p-6">No events found. Keep exploring!</p>';
            return;
        }

        const container = document.createElement('div');
        container.classList.add('grid', 'gap-4', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');

        events.forEach(evento => {
            const card = createEventCard(evento);
            container.appendChild(card);
        });

        searchResults.appendChild(container);
    }

    function createEventCard(evento) {
        const card = document.createElement('div');
        card.classList.add('bg-white', 'overflow-hidden', 'shadow-md', 'rounded-lg');
        
        card.addEventListener('click', () => {
            showEventDetails(evento);
        });

        const img = document.createElement('img');
        img.classList.add('w-full', 'h-64', 'object-cover', 'object-center');
        img.src = evento.images;
        img.alt = evento.nombre;

        const content = document.createElement('div');
        content.classList.add('p-4');

        const title = document.createElement('h3');
        title.classList.add('text-xl', 'font-medium', 'text-gray-900');
        title.textContent = evento.nombre;

        const location = document.createElement('p');
        location.classList.add('mt-2', 'text-sm', 'text-gray-600');
        location.textContent = `Ciudad: ${evento.ubicacion.ciudad}`;

        content.appendChild(title);
        content.appendChild(location);

        card.appendChild(img);
        card.appendChild(content);

        return card;
    }
}

document.addEventListener('DOMContentLoaded', initializeEvents);
