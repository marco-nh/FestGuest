let eventos = [];

function initializeEvents() {
    fetch('/src/static/events.json')
        .then(response => response.json())
        .then(data => {
            eventos = data.eventos;
            setupSearch();
            handleSearch();
        })
        .catch(error => console.error('Error loading events:', error));

    
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
        container.classList.add('grid', 'gap-4');
    
        events.forEach(evento => {
            const card = createEventCard(evento);
            container.appendChild(card);
        });
    
        searchResults.appendChild(container);
    }
    

    function createEventCard(evento) {
        const card = document.createElement('a');
        card.href = '#';
        card.classList.add('flex', 'items-center', 'bg-white', 'border', 'border-gray-200', 'rounded-lg', 'shadow', 'hover:bg-gray-100', 'dark:border-gray-700', 'dark:bg-gray-800', 'dark:hover:bg-gray-700',"hover:shadow-2xl","hover:contrast-125","transition-all","hover:scale-105");
    
        card.addEventListener('click', () => {
            showEventDetails(evento);
        });
    
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('flex-shrink-0', 'h-48', 'w-48', 'rounded-l-lg', 'overflow-hidden');
    
        const img = document.createElement('img');
        img.classList.add('object-cover', 'w-full', 'h-full');
        img.src = evento.images;
        img.alt = evento.nombre;
    
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);
    
        const content = document.createElement('div');
        content.classList.add('flex', 'flex-col', 'p-4', 'flex-grow');
    
        const title = document.createElement('h5');
        title.classList.add('mb-2', 'text-xl', 'font-bold', 'text-gray-900', 'dark:text-white');
        title.textContent = evento.nombre;
    
        const description = document.createElement('p');
        description.classList.add('mb-3', 'text-sm', 'text-gray-700', 'dark:text-gray-400');
        description.textContent = evento.descripcion;
    
        content.appendChild(title);
        content.appendChild(description);
        card.appendChild(content);
    
        return card;
    }
    
}

document.addEventListener('DOMContentLoaded', initializeEvents);
