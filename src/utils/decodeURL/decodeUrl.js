function decodeSearchTermFromUrl() {
    let urlParams = new URLSearchParams(window.location.search);
    let searchTermEncoded = urlParams.get('search');
    if (searchTermEncoded) {
        let searchTermDecoded = decodeURIComponent(atob(searchTermEncoded));
        document.getElementById('voice-search').value = searchTermDecoded;
    }
}

// Waiting the DOM content
document.addEventListener("DOMContentLoaded", function() {
    decodeSearchTermFromUrl();
});
