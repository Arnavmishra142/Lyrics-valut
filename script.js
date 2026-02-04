/**
 * ALFAAZ - ENGINE
 * Powered by Genius Lyrics API via RapidAPI
 * Updated with Dynamic SEO Logic
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

// === SEO FUNCTIONS (NEW ADDITION) ===
function updateSEO(songTitle, artistName, albumArt) {
    // 1. Change Browser Tab Title
    document.title = `${songTitle} Lyrics - ${artistName} | Alfaaz`;

    // 2. Change Description for Google
    const desc = `Read and copy lyrics of ${songTitle} by ${artistName}. Get aesthetic text format for Instagram and WhatsApp status via Alfaaz.`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc) metaDesc.setAttribute("content", desc);

    // 3. Change Link Preview (WhatsApp/Insta)
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if(ogTitle) ogTitle.setAttribute("content", `🎵 ${songTitle} - ${artistName} Lyrics`);

    const ogImg = document.querySelector('meta[property="og:image"]');
    if(ogImg && albumArt) ogImg.setAttribute("content", albumArt);
}

function resetSEO() {
    // Reset to Default when going back
    document.title = "Alfaaz | Aesthetic Lyrics & One-Click Copy Tool";
    const metaDesc = document.querySelector('meta[name="description"]');
    if(metaDesc) metaDesc.setAttribute("content", "Find song lyrics in an aesthetic format. Copy full lyrics with one click.");
}

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
        resultsContainer.innerHTML = '<div style="color:red; grid-column:1/-1; text-align:center;">Error connecting to Alfaaz. Check console.</div>';
    }
}

// === DISPLAY CARDS ===
function displayResults(hits) {
    resultsContainer.innerHTML = hits.map(hit => {
        const song = hit.result;
        // Escape single quotes in title/artist to prevent JS errors
        const safeTitle = song.title_with_featured.replace(/'/g, "\\'");
        const safeArtist = song.primary_artist.name.replace(/'/g, "\\'");

        return `
            <div class="result-card" onclick="fetchLyrics('${song.id}', '${safeTitle}', '${safeArtist}', '${song.header_image_url}')">
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
    
    document.getElementById('lyricsContent').textContent = "Unlocking Alfaaz... extracting lyrics...";
    
    // === TRIGGER SEO UPDATE ===
    updateSEO(title, artist, imgUrl);

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
        
        let lyricsText = "";
        
        if (data.lyrics && data.lyrics.lyrics && data.lyrics.lyrics.body) {
             const tempDiv = document.createElement("div");
             tempDiv.innerHTML = data.lyrics.lyrics.body.html;
             lyricsText = tempDiv.innerText; 
        } else {
            lyricsText = "Lyrics restricted or not found in Alfaaz.";
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
    
    // === RESET SEO ===
    resetSEO();

    // Reset background
    document.getElementById('bgImage').style.backgroundImage = "url('https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=1200&q=80')";
}

function copyLyrics() {
    const title = document.getElementById('songTitle').textContent;
    const artist = document.getElementById('artistName').textContent;
    const lyrics = document.getElementById('lyricsContent').textContent;
    
    const formattedText = `🎧 ${title} - ${artist}\n\n${lyrics}\n\n(Copied from Alfaaz)`;

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

document.getElementById('backBtn').addEventListener('click', goBack);
