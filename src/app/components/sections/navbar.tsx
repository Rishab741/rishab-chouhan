'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';

interface PortfolioData {
    name: string;
    role: string;
    bio: string;
    contact: {
        email: string;
        linkedin: string;
        github: string;
        phone: string;
        location: string;
    };
    skills: {
        [category: string]: string[];
    };
    experience: {
        role: string;
        company: string;
        duration: string;
        description: string;
    }[];
    projects: {
        title: string;
        description: string;
        technologies: string[];
        contribution: string;
    }[];
    education: {
        degree: string;
        institution: string;
        duration: string;
    }[];
}

interface NavbarProps {
    portfolioData: PortfolioData;
    onThemeToggle: () => void;
    currentTheme: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
    portfolioData, 
    onThemeToggle, 
    currentTheme 
}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const navLinks = ['Skills', 'Projects', 'Contact'];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id.toLowerCase());
        if (element && navRef.current) {
            const navbarHeight = navRef.current.offsetHeight;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ 
                top: elementPosition - navbarHeight, 
                behavior: 'smooth' 
            });
        }
    };

    return (
        <nav
            ref={navRef}
            className={`fixed top-0 z-40 w-full transition-all duration-500 ${
                isScrolled
                    ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-lg border-b border-gray-200/20 dark:border-gray-700/20'
                    : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105"
                >
                    {portfolioData.name.split(' ')[0]}
                </button>

                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => (
                        <button
                            key={link}
                            onClick={() => scrollToSection(link)}
                            className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 font-semibold relative group"
                        >
                            {link}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={onThemeToggle}
                    className="p-3 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-110 hover:rotate-180"
                    aria-label="Toggle theme"
                >
                    {currentTheme === 'dark' ? (
                        <Sun className="w-6 h-6 text-yellow-500" />
                    ) : (
                        <Moon className="w-6 h-6 text-gray-700" />
                    )}
                </button>
            </div>
        </nav>
    );
};