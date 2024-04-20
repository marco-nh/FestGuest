function decodeSearchTermFromUrl() {
    let urlParams = new URLSearchParams(window.location.search);
    let searchTermEncoded = urlParams.get('search');
    if (searchTermEncoded) {
        let searchTermDecoded = decodeURIComponent(atob(searchTermEncoded));
        document.getElementById('voice-search').value = searchTermDecoded;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    decodeSearchTermFromUrl();
});
