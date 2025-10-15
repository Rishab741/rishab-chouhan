'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useTypingEffect } from '../hooks';
import { AnimatedSection } from '../ui';

interface PortfolioData {
    name: string;
    role: string;
    bio: string;
    // ... other properties
}

interface HeaderProps {
    portfolioData: PortfolioData;
}

export const Header: React.FC<HeaderProps> = ({ portfolioData }) => {
    const typedRole = useTypingEffect(portfolioData.role, 70, 500);

    return (
        <header id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
            </div>

            <div className="container mx-auto px-6 text-center max-w-7xl relative z-10">
                <AnimatedSection>
                    <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
                        <span className="block text-gray-900 dark:text-white mb-4">Hello, I'm</span>
                        <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                            {portfolioData.name.split(' ')[0]}
                        </span>
                    </h1>

                    <h2 className="text-2xl md:text-4xl font-bold text-gray-700 dark:text-gray-300 mb-8 min-h-[4rem] md:min-h-[3rem]">
                        <span className="typing-cursor">{typedRole}</span>
                    </h2>

                    <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
                        {portfolioData.bio}
                    </p>

                    <div className="flex justify-center gap-6 flex-wrap">
                        <button
                            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
                        >
                            <span className="relative z-10">Get In Touch</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </button>

                        <button
                            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-10 py-5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-gray-300/50 dark:border-gray-700/50 text-gray-800 dark:text-gray-100 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
                        >
                            View My Work
                        </button>
                    </div>

                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
                        <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                </AnimatedSection>
            </div>
        </header>
    );
};