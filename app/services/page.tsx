export default function ServicesPage() {
  const services = [
    {
      icon: '🔐',
      title: 'Secure Authentication',
      description: 'Advanced Discord OAuth integration with encrypted token storage and secure session management.',
    },
    {
      icon: '⚡',
      title: 'High Performance',
      description: 'Built with Next.js 15 for blazing-fast page loads and optimal user experience.',
    },
    {
      icon: '🎨',
      title: 'Modern UI/UX',
      description: 'Futuristic design with glassmorphism effects, custom animations, and responsive layouts.',
    },
    {
      icon: '🔧',
      title: 'Custom Solutions',
      description: 'Tailored technology solutions designed to meet your specific requirements.',
    },
    {
      icon: '📊',
      title: 'Data Management',
      description: 'Efficient SQLite database integration for reliable data storage and retrieval.',
    },
    {
      icon: '🚀',
      title: 'Scalable Architecture',
      description: 'Built to scale with your needs using modern web technologies and best practices.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-orbitron font-black mb-6 glow-text">
            SERVICES
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Cutting-edge technology solutions for the modern era
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="glass-effect rounded-xl p-6 border border-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-orbitron font-bold mb-3 text-white">
                {service.title}
              </h3>
              <p className="text-gray-400 font-rajdhani leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center glass-effect rounded-xl p-12 border border-white/30">
          <h2 className="text-3xl font-orbitron font-bold mb-4 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-8 font-rajdhani text-lg">
            Join Archive Industries today and experience the future of technology
          </p>
          <a
            href="/verify"
            className="inline-block px-8 py-4 bg-white text-black font-orbitron font-bold text-lg rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/50"
          >
            ACCESS PORTAL
          </a>
        </div>
      </div>
    </div>
  );
}
