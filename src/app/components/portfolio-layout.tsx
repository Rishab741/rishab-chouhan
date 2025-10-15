'use client';

import React from 'react';
import { useDarkMode } from './hooks';
import { ScrollProgressBar } from './ui';
import { Navbar } from './sections/navbar';
import { Header } from './sections/header';
import { Skills } from './sections/skills';
import { Projects } from './sections/projects';
import { Experience } from './sections/experience';
import { PortfolioData } from './types';

// Import directly from your JSON file
interface PortfolioClientLayoutProps {
  portfolioData: PortfolioData;
}

export default function PortfolioClientLayout({portfolioData}: PortfolioClientLayoutProps) {
    const [theme, toggleTheme] = useDarkMode();

    return (
        <>
            <GlobalStyles />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-700 selection:bg-purple-500/30 overflow-x-hidden">
                <ScrollProgressBar />
                <Navbar 
                    portfolioData={portfolioData as PortfolioData} 
                    onThemeToggle={toggleTheme} 
                    currentTheme={theme} 
                />

                <main>
                    <Header portfolioData={portfolioData as PortfolioData} />
                    <Skills portfolioData={portfolioData as PortfolioData} />
                    <Experience portfolioData={portfolioData as PortfolioData} />
                    <Projects portfolioData={portfolioData as PortfolioData} />
                    {/* Add Education, Contact, Footer as you create them */}
                </main>
            </div>
        </>
    );
}

const GlobalStyles = () => (
    <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        * {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Inter', sans-serif;
            overflow-x: hidden;
        }

        .bg-grid-pattern {
            background-image:
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 50px 50px;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-10px) rotate(1deg); }
            50% { transform: translateY(-20px) rotate(0deg); }
            75% { transform: translateY(-10px) rotate(-1deg); }
        }

        @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(10px) rotate(-1deg); }
            50% { transform: translateY(20px) rotate(0deg); }
            75% { transform: translateY(10px) rotate(1deg); }
        }

        @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        @keyframes blink {
            from, to { color: transparent; }
            50% { color: inherit; }
        }

        @keyframes orbit {
            from {
                transform: rotate(var(--angle)) translateX(var(--radius)) rotate(calc(-1 * var(--angle)));
            }
            to {
                transform: rotate(calc(var(--angle) + 360deg)) translateX(var(--radius)) rotate(calc(-1 * var(--angle) - 360deg));
            }
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        .animate-float {
            animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
            animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
        }

        .typing-cursor::after {
            content: '|';
            animation: blink 1s step-end infinite;
        }

        .animate-shimmer {
            animation: shimmer 2.5s infinite linear;
        }

        .bg-shimmer-gradient {
            background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.2) 50%, transparent 80%);
        }

        .dark .bg-shimmer-gradient {
            background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.05) 50%, transparent 80%);
        }

        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: #1f2937;
        }

        ::-webkit-scrollbar-thumb {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(135deg, #2563eb, #7c3aed);
        }

        ::selection {
            background-color: rgba(139, 92, 246, 0.3);
            color: inherit;
        }
    `}</style>
);