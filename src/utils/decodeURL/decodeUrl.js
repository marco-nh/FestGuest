function decodeSearchTermFromUrl() {
    var urlParams = new URLSearchParams(window.location.search);
    var searchTermEncoded = urlParams.get('search');
    if (searchTermEncoded) {
        var searchTermDecoded = decodeURIComponent(atob(searchTermEncoded));
        document.getElementById('voice-search').value = searchTermDecoded;
    }
}

// Waiting the DOM content
document.addEventListener("DOMContentLoaded", function() {
    decodeSearchTermFromUrl();
});