'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { 
  MapPin, Phone
} from 'lucide-react';

import { useDarkMode } from './hooks';
import { PortfolioData } from './types';
import { Navbar } from './sections/navbar';
import { Header } from './sections/header';
import { Skills } from './sections/skills';
import { Projects } from './sections/projects';
import { Experience } from './sections/experience';
import AdvancedChatbot from './AdvancedChatbot';

// --- 1. Background System ---
const GlobalAmbientGlow = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
    <div className="absolute inset-0 bg-black" />
    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
    <div 
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
  </div>
);

// --- 2. Main Refactored Component ---
export default function PortfolioClientLayout({ portfolioData }: { portfolioData: PortfolioData }) {
  const [theme, toggleTheme] = useDarkMode();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} bg-black text-white min-h-screen relative selection:bg-blue-500/30`}>
      <GlobalStyles />
      <GlobalAmbientGlow />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-[70]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar onThemeToggle={toggleTheme} currentTheme={theme} />
      </div>

      <main className="relative z-10">
        
        {/* Hero Section */}
        <section id="home">
          <Header portfolioData={portfolioData} />
        </section>

        {/* Skills Section - No spacing before this */}
        <section id="skills">
          <Skills portfolioData={portfolioData} />
        </section>

        {/* Experience Timeline */}
        <section id="experience" className="mt-24 md:mt-40">
          <Experience portfolioData={portfolioData} />
        </section>

        {/* Projects Grid */}
        <section id="projects" className="mt-24 md:mt-40">
          <Projects portfolioData={portfolioData} />
        </section>

        {/* Contact/CTA */}
        <section id="contact" className="py-24 px-6 text-center mt-24 md:mt-40">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto p-12 rounded-[3rem] bg-gradient-to-b from-zinc-900 to-black border border-white/10 shadow-2xl"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Based in {portfolioData.contact.location.split(',')[0]}
            </h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
              Available for full-time opportunities in Full-Stack Engineering, 
              Blockchain development, and AI integration.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`mailto:${portfolioData.contact.email}`}
                className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all"
              >
                Email Me
              </a>
              <a
                href={portfolioData.contact.linkedin}
                target="_blank"
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 transition-all"
              >
                LinkedIn
              </a>
            </div>
          </motion.div>
        </section>

        {/* Chatbot Anchor */}
        <div className="fixed bottom-8 right-8 z-50">
          <AdvancedChatbot />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 text-center text-zinc-600">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center gap-8 mb-6">
            <MapPin className="w-4 h-4" /> {portfolioData.contact.location}
            <Phone className="w-4 h-4" /> {portfolioData.contact.phone}
          </div>
          <p className="text-xs uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} {portfolioData.name} — Core Contributor to Startup Success
          </p>
        </div>
      </footer>
    </div>
  );
}

const GlobalStyles = () => (
  <style jsx global>{`
    html { scroll-behavior: smooth; }
    body { background: black; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
  `}</style>
);