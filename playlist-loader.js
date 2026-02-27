// Load playlist from playlist.json
async function loadPlaylist() {
    try {
        const response = await fetch('playlist.json');
        const data = await response.json();
        
        // Assign to global playlist variable from script.js
        if (typeof playlist !== 'undefined') {
            playlist.length = 0;
            playlist.push(...data);
        }
        
        console.log('✅ Playlist loaded:', data.length, 'songs');
        return data;
    } catch (error) {
        console.error('Error loading playlist:', error);
        const fallback = [
            {
                title: 'East Coast',
                artist: 'alexgoffline',
                videoId: 'avhK06MdPn4',
                duration: 180000
            }
        ];
        
        if (typeof playlist !== 'undefined') {
            playlist.length = 0;
            playlist.push(...fallback);
        } else {
            window._playlistData = fallback;
        }
        
        return fallback;
    }
}

// Auto-load playlist when this script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPlaylist);
} else {
    loadPlaylist();
}
