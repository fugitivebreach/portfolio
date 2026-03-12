import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-cyber-blue/20 bg-cyber-gray/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-orbitron font-bold text-lg text-white">
              ARCHIVE INDUSTRIES
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Next-generation technology platform delivering cutting-edge solutions for the future.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-orbitron font-semibold text-sm text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-orbitron font-semibold text-sm text-white uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-orbitron font-semibold text-sm text-white uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://discord.gg/archive"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-cyber-gray border border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-cyber-blue/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm font-rajdhani">
              © {currentYear} Archive Industries. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs font-rajdhani">
              Powered by cutting-edge technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
