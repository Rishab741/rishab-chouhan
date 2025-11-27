'use client';

import React from 'react';
import { useDarkMode } from './hooks';
import { Navbar } from './sections/navbar';
import { Header } from './sections/header';
import { Skills } from './sections/skills';
import { Projects } from './sections/projects';
import { Experience } from './sections/experience';
import { PortfolioData } from './types';
import AdvancedChatbot from './AdvancedChatbot'; // Assuming you have this component

// --- 1. Internal Design System Components ---

/**
 * GlobalAmbientGlow
 * Creates the "MNC" atmosphere: deep dark background, moving color blobs, and film grain.
 */
const GlobalAmbientGlow = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
        {/* Deep Background Base */}
        <div className="absolute inset-0 bg-black" />

        {/* Moving Ambient Blobs - using mix-blend-screen for glowing effect */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse mix-blend-screen opacity-60" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000 mix-blend-screen opacity-50" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse delay-2000 mix-blend-screen opacity-40" />

        {/* Cinematic Noise Overlay - Essential for the "High End" texture */}
        {/* We use a SVG data URI for noise to avoid external dependencies */}
        <div 
            className="absolute inset-0 opacity-[0.04] brightness-100 contrast-150 pointer-events-none"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
        />
    </div>
);

// --- 2. Main Layout Component ---

interface PortfolioClientLayoutProps {
    portfolioData: PortfolioData;
}

export default function PortfolioClientLayout({ portfolioData }: PortfolioClientLayoutProps) {
    const [theme, toggleTheme] = useDarkMode();

    return (
        <>
            <GlobalStyles />
            
            {/* Force dark mode styles as the base for this aesthetic. 
              The 'selection' class gives the highlight color when users select text.
            */}
            <div className={`relative min-h-screen text-white selection:bg-purple-500/30 ${theme === 'dark' ? 'dark' : ''}`}>
                
                {/* The Atmospheric Background Layer */}
                <GlobalAmbientGlow />

                {/* Navigation - Floating Dock Style */}
                <Navbar 
                    onThemeToggle={toggleTheme} 
                    currentTheme={theme} 
                />

                {/* Main Content Area */}
                <main className="relative z-10 flex flex-col gap-24 md:gap-32 pb-20">
                    
                    {/* Hero Section */}
                    <Header portfolioData={portfolioData} />
                    
                    {/* Skills Constellation */}
                    <Skills portfolioData={portfolioData} />
                    
                    {/* Experience Timeline */}
                    <Experience portfolioData={portfolioData} />
                    
                    {/* Projects Grid */}
                    <Projects portfolioData={portfolioData} />
                    
                    {/* Floating Chatbot */}
                    <div className="fixed bottom-8 right-8 z-50">
                        <AdvancedChatbot />
                    </div>

                </main>

                {/* Minimalist Footer */}
                <footer className="relative z-10 py-12 text-center border-t border-white/5 bg-black/40 backdrop-blur-xl">
                    <div className="container mx-auto px-6">
                        <p className="text-gray-500 text-sm font-medium tracking-wide">
                            © {new Date().getFullYear()} {portfolioData.name}. 
                            <span className="mx-2 opacity-30">|</span> 
                            Crafted with Next.js & Framer Motion.
                        </p>
                    </div>
                </footer>

            </div>
        </>
    );
}

// --- 3. Global CSS Styles ---

const GlobalStyles = () => (
    <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        :root {
            --foreground-rgb: 255, 255, 255;
            --background-start-rgb: 0, 0, 0;
            --background-end-rgb: 0, 0, 0;
        }

        /* Smooth scrolling setup */
        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: black;
            overflow-x: hidden;
            -webkit-font-smoothing: antialiased; /* Critical for "Apple" text sharpness */
            -moz-osx-font-smoothing: grayscale;
        }

        /* Custom Scrollbar 
           Matches the dark aesthetic (thin, dark grey)
        */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #000;
        }
        ::-webkit-scrollbar-thumb {
            background: #333;
            border-radius: 4px;
            border: 2px solid #000;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        /* Animations */
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
        
        @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .animate-float {
            animation: float 6s ease-in-out infinite;
        }

        .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
        }
    `}</style>
);