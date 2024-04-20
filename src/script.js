document.addEventListener("DOMContentLoaded", function() {
    let searchForm = document.getElementById('searchForm');
    let searchButton = document.getElementById('searchButton');
    let searchInput = document.getElementById('voice-search');

    // Encoding the search in 64 base
    function performSearch() {
        let searchTerm = searchInput.value;
        let encodedSearchTerm = btoa(searchTerm);
        window.location.href = '/src/pages/events/events.html?search=' + encodedSearchTerm;
    }

    searchButton.addEventListener('click', performSearch);

    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            performSearch();
        }
    });

    // Prevent default to the form
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
    });

    document.getElementById('luckyButton').addEventListener('click', () => {
        console.log("Implementar un tutorial")
    });
});
