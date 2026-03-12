'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface Song {
  title: string;
  artist: string;
  videoId: string;
  duration: number;
}

export default function GlobalMusicPlayer() {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // Load playlist
  useEffect(() => {
    fetch('/playlist.json')
      .then(res => res.json())
      .then(data => {
        setPlaylist(data);
        console.log('✅ Playlist loaded:', data.length, 'songs');
      })
      .catch(err => console.error('Failed to load playlist:', err));
  }, []);

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      console.log('✅ YouTube API ready');
      initializePlayer();
    };
  }, []);

  const initializePlayer = () => {
    if (typeof window === 'undefined' || !window.YT || playlist.length === 0) return;

    // Create hidden container
    let container = document.getElementById('global-youtube-player');
    if (!container) {
      container = document.createElement('div');
      container.id = 'global-youtube-player';
      container.style.display = 'none';
      document.body.appendChild(container);
    }

    playerRef.current = new window.YT.Player('global-youtube-player', {
      height: '0',
      width: '0',
      videoId: playlist[0]?.videoId || 'avhK06MdPn4',
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        playsinline: 1,
        enablejsapi: 1
      },
      events: {
        onReady: () => {
          console.log('✅ Player ready');
          setIsPlayerReady(true);
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
          } else if (event.data === window.YT.PlayerState.ENDED) {
            // Auto-play next track
            playNext();
          }
        },
        onError: (event: any) => {
          console.error('❌ Player error:', event.data);
        }
      }
    });
  };

  // Initialize player when playlist loads
  useEffect(() => {
    if (playlist.length > 0 && !playerRef.current) {
      initializePlayer();
    }
  }, [playlist]);

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    loadTrack(nextIndex);
  };

  const playPrevious = () => {
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    loadTrack(prevIndex);
  };

  const loadTrack = (index: number) => {
    if (!playerRef.current || !playlist[index]) return;
    
    playerRef.current.loadVideoById({
      videoId: playlist[index].videoId,
      startSeconds: 0
    });
    
    setTimeout(() => {
      playerRef.current?.playVideo();
    }, 500);
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  // Expose player controls globally
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    (window as any).globalMusicPlayer = {
      play: () => playerRef.current?.playVideo(),
      pause: () => playerRef.current?.pauseVideo(),
      next: playNext,
      previous: playPrevious,
      toggle: togglePlay,
      getCurrentSong: () => playlist[currentIndex],
      isPlaying: () => isPlaying
    };
  }, [currentIndex, isPlaying, playlist]);

  // Broadcast current song to PersistentMusicPlayer
  useEffect(() => {
    if (playlist[currentIndex] && isPlaying) {
      window.postMessage({
        type: 'musicUpdate',
        title: playlist[currentIndex].title,
        artist: playlist[currentIndex].artist,
        isPlaying: isPlaying
      }, '*');
    }
  }, [currentIndex, isPlaying, playlist]);

  return null; // This component doesn't render anything visible
}
