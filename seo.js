/**
 * ALFAAZ - DYNAMIC SEO MANAGER
 * Updates page title and metadata when a song opens.
 */

function updateSEO(songTitle, artistName, albumArt) {
    // 1. Update Browser Tab Title
    document.title = `${songTitle} Lyrics - ${artistName} | Alfaaz`;

    // 2. Update Meta Description (Google Search ke liye)
    const desc = `Read and copy lyrics of ${songTitle} by ${artistName}. Get aesthetic text format for Instagram and WhatsApp status via Alfaaz.`;
    document.querySelector('meta[name="description"]').setAttribute("content", desc);

    // 3. Update Open Graph (WhatsApp sharing ke liye)
    document.querySelector('meta[property="og:title"]').setAttribute("content", `🎵 ${songTitle} - ${artistName} Lyrics`);
    document.querySelector('meta[property="og:description"]').setAttribute("content", "Click to read full lyrics and copy instantly on Alfaaz.");
    
    // Agar Album Art hai toh use share image bana do
    if(albumArt) {
        document.querySelector('meta[property="og:image"]').setAttribute("content", albumArt);
        document.querySelector('meta[property="twitter:image"]').setAttribute("content", albumArt);
    }
}

function resetSEO() {
    document.title = "Alfaaz | Aesthetic Lyrics & One-Click Copy Tool";
    document.querySelector('meta[name="description"]').setAttribute("content", "Find song lyrics in an aesthetic format. Copy full lyrics with one click.");
}
