import type { Metadata } from 'next';
import { Orbitron, Rajdhani } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PersistentMusicPlayer from '@/components/PersistentMusicPlayer';
import GlobalMusicPlayer from '@/components/GlobalMusicPlayer';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  variable: '--font-rajdhani',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Archive Industries',
  description: 'High-tech futuristic platform',
  icons: {
    icon: '/ArchiveIndustries2.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${orbitron.variable} ${rajdhani.variable}`}>
      <body className="bg-cyber-black text-white font-rajdhani antialiased">
        <GlobalMusicPlayer />
        <Navbar />
        <PersistentMusicPlayer />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
