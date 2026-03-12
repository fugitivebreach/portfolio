'use client';

import { useEffect, useState } from 'react';

export default function PersistentMusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSong, setCurrentSong] = useState({ title: 'East Coast', artist: 'alexgoffline' });
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Listen for music player events from the iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'musicUpdate') {
        setCurrentSong({ title: event.data.title, artist: event.data.artist });
        setIsPlaying(event.data.isPlaying);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Always show the miniplayer

  return (
    <div className={`fixed top-24 right-6 z-50 transition-all duration-300 ${isExpanded ? 'w-80' : 'w-16'}`}>
      <div className="glass-effect rounded-xl p-4 border border-white/30 shadow-2xl shadow-white/20">
        {isExpanded ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 18V5l12-2v13M6 18a3 3 0 100-6 3 3 0 000 6zm12-2a3 3 0 100-6 3 3 0 000 6z"/>
                </svg>
                <span className="text-xs font-orbitron uppercase tracking-wide text-gray-400">Now Playing</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="ml-2 text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div>
              <p className="font-orbitron font-bold text-base mb-1 text-white truncate">{currentSong.title}</p>
              <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
            </div>
            
            {/* Playback controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => {
                  const iframe = document.querySelector('iframe[src*="old-site"]') as HTMLIFrameElement;
                  if (iframe?.contentWindow) {
                    iframe.contentWindow.postMessage({ type: 'musicControl', action: 'previous' }, '*');
                  }
                }}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              <button
                onClick={() => {
                  const iframe = document.querySelector('iframe[src*="old-site"]') as HTMLIFrameElement;
                  if (iframe?.contentWindow) {
                    iframe.contentWindow.postMessage({ type: 'musicControl', action: 'toggle' }, '*');
                  }
                }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition-all"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>
              <button
                onClick={() => {
                  const iframe = document.querySelector('iframe[src*="old-site"]') as HTMLIFrameElement;
                  if (iframe?.contentWindow) {
                    iframe.contentWindow.postMessage({ type: 'musicControl', action: 'next' }, '*');
                  }
                }}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18V6l8.5 6zm8.5-6l8.5 6V6z"/>
                </svg>
              </button>
            </div>
            
            <div className="flex items-center space-x-1">
              <div className="w-1 h-3 bg-white animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-2 bg-white animate-pulse" style={{ animationDelay: '300ms' }}></div>
              <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '450ms' }}></div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsExpanded(true);
              // Auto-play if not playing
              if (!isPlaying) {
                const iframe = document.querySelector('iframe[src*="old-site"]') as HTMLIFrameElement;
                if (iframe?.contentWindow) {
                  iframe.contentWindow.postMessage({ type: 'musicControl', action: 'play' }, '*');
                }
              }
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all animate-pulse"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 18V5l12-2v13M6 18a3 3 0 100-6 3 3 0 000 6zm12-2a3 3 0 100-6 3 3 0 000 6z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
