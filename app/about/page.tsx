import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-6 glow-text">
            ABOUT US
          </h1>
          <p className="text-xl text-gray-400">
            Building the future, one innovation at a time
          </p>
        </div>

        {/* Logo Section */}
        <div className="flex justify-center mb-12">
          <div className="relative w-64 h-64">
            <Image
              src="/ArchiveIndustries2.png"
              alt="Archive Industries"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Content */}
        <div className="glass-effect rounded-xl p-8 space-y-8">
          <section>
            <h2 className="text-3xl font-orbitron font-bold text-white mb-4 flex items-center gap-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              Our Mission
            </h2>
            <p className="text-gray-300 font-rajdhani text-lg leading-relaxed">
              Archive Industries is dedicated to pushing the boundaries of technology and innovation.
              We create cutting-edge solutions that combine security, performance, and stunning design
              to deliver exceptional user experiences.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-orbitron font-bold text-white mb-4 flex items-center gap-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
              </svg>
              What We Do
            </h2>
            <p className="text-gray-300 font-rajdhani text-lg leading-relaxed mb-4">
              We specialize in building next-generation web platforms with advanced authentication
              systems, real-time features, and modern UI/UX design. Our technology stack includes:
            </p>
            <ul className="space-y-2 text-gray-400 font-rajdhani">
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
                </svg>
                <span>Next.js 15 with TypeScript for type-safe, performant applications</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
                <span>Discord OAuth for secure authentication and authorization</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
                </svg>
                <span>SQLite for efficient data management</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
                <span>Tailwind CSS for beautiful, responsive designs</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-orbitron font-bold text-white mb-4 flex items-center gap-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-cyber-gray/50 p-4 rounded-lg border border-white/20">
                <h3 className="font-orbitron font-bold text-white mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
                  </svg>
                  Innovation
                </h3>
                <p className="text-sm text-gray-400 font-rajdhani">
                  Constantly pushing technological boundaries
                </p>
              </div>
              <div className="bg-cyber-gray/50 p-4 rounded-lg border border-white/20">
                <h3 className="font-orbitron font-bold text-white mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                  Security
                </h3>
                <p className="text-sm text-gray-400 font-rajdhani">
                  Your data protection is our priority
                </p>
              </div>
              <div className="bg-cyber-gray/50 p-4 rounded-lg border border-white/20">
                <h3 className="font-orbitron font-bold text-white mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
                  </svg>
                  Excellence
                </h3>
                <p className="text-sm text-gray-400 font-rajdhani">
                  Delivering quality in every project
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
