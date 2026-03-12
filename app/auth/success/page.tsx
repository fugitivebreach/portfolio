'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AuthSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-black via-cyber-gray to-cyber-black" />

      {/* Success card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass-effect rounded-2xl p-8 border-2 border-white/30 shadow-2xl shadow-white/20 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <Image
                src="/ArchiveIndustries2.png"
                alt="Archive Industries"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-orbitron font-bold mb-4 text-white glow-text">
            VERIFIED
          </h1>
          <p className="text-gray-300 font-rajdhani text-lg mb-6">
            Your identity has been successfully verified
          </p>

          {/* Countdown */}
          <div className="mb-6">
            <p className="text-gray-400 font-rajdhani mb-2">
              Redirecting to homepage in
            </p>
            <div className="text-5xl font-orbitron font-bold text-white">
              {countdown}
            </div>
          </div>

          {/* Manual redirect button */}
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-white text-black font-orbitron font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/50"
          >
            GO NOW
          </button>
        </div>
      </div>
    </div>
  );
}
