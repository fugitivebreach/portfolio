// Load playlist from playlist.json
let playlist = [];

async function loadPlaylist() {
    try {
        const response = await fetch('playlist.json');
        playlist = await response.json();
        console.log('✅ Playlist loaded:', playlist.length, 'songs');
        return playlist;
    } catch (error) {
        console.error('Error loading playlist:', error);
        playlist = [
            {
                title: 'East Coast',
                artist: 'alexgoffline',
                videoId: 'avhK06MdPn4',
                duration: 180000
            }
        ];
        return playlist;
    }
}

// Auto-load playlist when this script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPlaylist);
} else {
    loadPlaylist();
}
