import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with banner */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/ArchiveIndustries1.png"
          alt="Archive Industries"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-black/50 via-cyber-black/70 to-cyber-black" />
      </div>

      {/* Cyber grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-30 z-0" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/ArchiveIndustries2.png"
              alt="Archive Industries Logo"
              width={300}
              height={300}
              className="drop-shadow-2xl"
              priority
            />
          </div>

          {/* Title */}
          <h1 className="text-7xl md:text-9xl font-orbitron font-black mb-6 glow-text tracking-wider">
            ARCHIVE
          </h1>
          <h2 className="text-4xl md:text-6xl font-orbitron font-light mb-8 text-white tracking-widest">
            INDUSTRIES
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
            Next-generation technology platform. Secure. Advanced. Futuristic.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6">
            <a
              href="/verify"
              className="group relative px-8 py-4 bg-white text-black font-orbitron font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/50"
            >
              <span className="relative z-10">ACCESS PORTAL</span>
              <div className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </a>
            
            <a
              href="/portfolio"
              className="px-8 py-4 border-2 border-white text-white font-orbitron font-bold text-lg rounded-lg transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 hover:shadow-lg hover:shadow-white/50"
            >
              VIEW PORTFOLIO
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl w-full">
            <div className="glass-effect p-6 rounded-lg">
              <div className="text-4xl font-orbitron font-bold text-white mb-2">99.9%</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Uptime</div>
            </div>
            <div className="glass-effect p-6 rounded-lg">
              <div className="text-4xl font-orbitron font-bold text-white mb-2">24/7</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Support</div>
            </div>
            <div className="glass-effect p-6 rounded-lg">
              <div className="text-4xl font-orbitron font-bold text-white mb-2">∞</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
