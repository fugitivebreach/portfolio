'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function MiniPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSong] = useState({ title: 'East Coast', artist: 'alexgoffline' });
  const pathname = usePathname();

  // Show mini player when user switches tabs while music is playing
  useEffect(() => {
    if (isPlaying) {
      setIsExpanded(true);
      const timer = setTimeout(() => setIsExpanded(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [pathname, isPlaying]);

  if (!isPlaying) return null;

  return (
    <div
      className={`fixed top-24 right-4 z-40 transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-16'
      }`}
    >
      <div className="glass-effect rounded-lg p-4 border border-white/30 shadow-lg shadow-white/20">
        {isExpanded ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-orbitron font-semibold text-sm text-white truncate">
                  {currentSong.title}
                </p>
                <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="ml-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button className="text-white hover:text-gray-300 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-300"
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
              <button className="text-white hover:text-gray-300 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18V6l8.5 6zm8.5-6l8.5 6V6z"/>
                </svg>
              </button>
            </div>

            <div className="w-full h-1 bg-cyber-gray rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-white rounded-full" />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black animate-pulse"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 18V5l12-2v13M6 18a3 3 0 100-6 3 3 0 000 6zm12-2a3 3 0 100-6 3 3 0 000 6z"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
