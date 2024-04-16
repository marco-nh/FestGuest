document.addEventListener("DOMContentLoaded", function() {
    var searchForm = document.getElementById('searchForm');
    var searchButton = document.getElementById('searchButton');
    var searchInput = document.getElementById('voice-search');

    // Encoding the search in 64 base
    function performSearch() {
        var searchTerm = searchInput.value;
        var encodedSearchTerm = btoa(searchTerm);
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

    function getRandomMessage() {
        const messages = [
            "You found a hidden treasure!",
            "Congratulations! You won a prize!",
            "Surprise! You're the lucky winner!",
            "You're feeling lucky today!",
            "Wow! You unlocked a secret!"
        ];
        const randomIndex = Math.floor(Math.random() * messages.length);
        return messages[randomIndex];
    }

    // Showing fun message
    function showFunMessage() {
        const funMessage = document.getElementById('fun-message');
        const message = getRandomMessage();
        funMessage.innerText = message;
        funMessage.classList.remove('hidden');
        funMessage.classList.remove('scale-0');
        funMessage.classList.add('bg-black-500', 'text-white', 'py-2', 'px-4', 'rounded-md', 'shadow-md', 'transition-all', 'duration-300', 'transform', 'scale-100');
        setTimeout(() => {
            funMessage.classList.add('scale-0');
            setTimeout(() => {
                funMessage.classList.add('hidden');
                funMessage.classList.remove('bg-black-500', 'text-white', 'py-2', 'px-4', 'rounded-md', 'shadow-md', 'transition-all', 'duration-300', 'transform', 'scale-100');
            }, 300); 
        }, 3000); 
    }

    document.getElementById('luckyButton').addEventListener('click', () => {
        showFunMessage();
    });
});
