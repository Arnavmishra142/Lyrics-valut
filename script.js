/**
 * LYRIC VAULT - ENGINE
 * Powered by Genius Lyrics API via RapidAPI
 */

const API_KEY = 'f273bac7c8msh2aa7a560484e824p115ce5jsn1087c9cd67e0';
const API_HOST = 'genius-song-lyrics1.p.rapidapi.com';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchHome = document.getElementById('searchHome');
const resultsContainer = document.getElementById('resultsContainer');
const lyricsViewer = document.getElementById('lyricsViewer');
const loadingSpinner = document.getElementById('loadingSpinner');

// === SEARCH FUNCTION ===
async function searchSongs(query) {
    if(!query) return;
    
    // Clear old results & show loading
    resultsContainer.innerHTML = '';
    loadingSpinner.style.display = 'block';
    
    try {
        const url = `https://${API_HOST}/search/?q=${encodeURIComponent(query)}&per_page=10&page=1`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': API_HOST
            }
        };

        const response = await fetch(url, options);
        const data = await response.json();
        
        loadingSpinner.style.display = 'none';

        // Check if hits exist (Genius API returns data.hits)
        if (data.hits && data.hits.length > 0) {
            displayResults(data.hits);
        } else {
            resultsContainer.innerHTML = '<div style="color:#aaa; grid-column:1/-1; text-align:center;">No songs found. Try a different name.</div>';
        }

    } catch (error) {
        console.error("Search Error:", error);
        loadingSpinner.style.display = 'none';
        resultsContainer.innerHTML = '<div style="color:red; grid-column:1/-1; text-align:center;">Error connecting to Vault. Check console.</div>';
    }
}

// === DISPLAY CARDS ===
function displayResults(hits) {
    resultsContainer.innerHTML = hits.map(hit => {
        const song = hit.result;
        return `
            <div class="result-card" onclick="fetchLyrics('${song.id}', '${song.title_with_featured}', '${song.primary_artist.name}', '${song.header_image_url}')">
                <img src="${song.header_image_thumbnail_url}" alt="${song.title}">
                <h3>${song.title}</h3>
                <p>${song.primary_artist.name}</p>
            </div>
        `;
    }).join('');
}

// === FETCH LYRICS (THE MAIN EVENT) ===
async function fetchLyrics(id, title, artist, imgUrl) {
    // 1. Switch View immediately
    searchHome.classList.add('hidden');
    lyricsViewer.classList.remove('hidden');
    
    // 2. Set basic details (Show loading for lyrics)
    document.getElementById('songTitle').textContent = title;
    document.getElementById('artistName').textContent = artist;
    document.getElementById('albumArt').src = imgUrl;
    document.getElementById('bgImage').style.backgroundImage = `url('${imgUrl}')`;
    document.getElementById('lyricsContent').textContent = "Unlocking Vault... extracting lyrics...";
    
    // 3. Call API
    try {
        const url = `https://${API_HOST}/song/lyrics/?id=${id}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': API_KEY,
                'x-rapidapi-host': API_HOST
            }
        };

        const response = await fetch(url, options);
        const data = await response.json();
        
        // Genius API sometimes returns HTML or plain text. Let's handle it.
        // Usually data.lyrics.lyrics.body.html or plain
        let lyricsText = "";
        
        if (data.lyrics && data.lyrics.lyrics && data.lyrics.lyrics.body) {
             // Agar HTML mein aaya toh text nikalenge
             const tempDiv = document.createElement("div");
             tempDiv.innerHTML = data.lyrics.lyrics.body.html;
             lyricsText = tempDiv.innerText; // Removes HTML tags
        } else {
            lyricsText = "Lyrics restricted or not found in Vault.";
        }

        document.getElementById('lyricsContent').textContent = lyricsText;

    } catch (error) {
        console.error("Lyrics Error:", error);
        document.getElementById('lyricsContent').textContent = "Failed to load lyrics. Try again later.";
    }
}

// === UI LOGIC: COPY & NAV ===

function goBack() {
    lyricsViewer.classList.add('hidden');
    searchHome.classList.remove('hidden');
    // Reset background
    document.getElementById('bgImage').style.backgroundImage = "url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1200&q=80')";
}

function copyLyrics() {
    const title = document.getElementById('songTitle').textContent;
    const artist = document.getElementById('artistName').textContent;
    const lyrics = document.getElementById('lyricsContent').textContent;
    
    // Format for Instagram/WhatsApp
    const formattedText = `🎧 ${title} - ${artist}\n\n${lyrics}\n\n(Copied from Lyric Vault)`;

    navigator.clipboard.writeText(formattedText).then(() => {
        const toast = document.getElementById('toastMsg');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    });
}

// Event Listeners
searchBtn.addEventListener('click', () => {
    searchSongs(searchInput.value.trim());
});

searchInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') searchSongs(searchInput.value.trim());
});
// SCRIPT.JS KE SABSE NEECHE YE LINE ADD KAR DE:
document.getElementById('backBtn').addEventListener('click', goBack);
