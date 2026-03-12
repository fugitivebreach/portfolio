'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCookie } from 'cookies-next';

export default function Navbar() {
  const [user, setUser] = useState<{ username: string; avatar: string } | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const userCookie = getCookie('user');
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie as string));
      } catch (e) {
        console.error('Failed to parse user cookie');
      }
    }
  }, []);

  const tabs = [
    { id: 'home', label: 'HOME', href: '/' },
    { id: 'portfolio', label: 'PORTFOLIO', href: '/portfolio' },
    { id: 'services', label: 'SERVICES', href: '/services' },
    { id: 'about', label: 'ABOUT', href: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-cyber-blue/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 transition-transform group-hover:scale-110">
              <Image
                src="/ArchiveIndustries2.png"
                alt="Archive Industries"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-orbitron font-bold text-xl glow-text hidden md:block">
              ARCHIVE INDUSTRIES
            </span>
          </Link>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 font-orbitron font-semibold text-sm tracking-wider transition-all duration-300 relative group ${
                  activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-white transition-transform duration-300 ${
                    activeTab === tab.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-lg">
                  {user.avatar && (
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span className="font-rajdhani font-semibold text-sm">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    setUser(null);
                    window.location.href = '/';
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-orbitron font-bold text-xs rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-red-600/50"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <Link
                href="/verify"
                className="px-6 py-2 bg-white text-black font-orbitron font-bold text-sm rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/50"
              >
                LOGIN
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
