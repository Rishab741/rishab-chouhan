'use client';
import React, { useState, useEffect } from 'react';
import { motion} from 'framer-motion';
import { Home, Code, Briefcase, Mail, Sun, Moon } from 'lucide-react';

interface NavbarProps {
    onThemeToggle: () => void;
    currentTheme: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onThemeToggle, currentTheme }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', icon: Home, id: 'home' },
        { name: 'Skills', icon: Code, id: 'skills' },
        { name: 'Work', icon: Briefcase, id: 'projects' }, // Renamed from Experience/Projects to generic "Work"
        { name: 'Contact', icon: Mail, id: 'contact' },
    ];

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
        >
            <div className={`
                flex items-center gap-2 p-2 rounded-full border transition-all duration-500
                ${scrolled 
                    ? 'bg-black/40 border-white/10 backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.5)]' 
                    : 'bg-transparent border-transparent'
                }
            `}>
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => scrollTo(item.id)}
                        className="relative group px-4 py-2 rounded-full hover:bg-white/10 transition-all"
                    >
                        <span className="flex items-center gap-2 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                            <item.icon size={16} />
                            <span className="hidden md:block">{item.name}</span>
                        </span>
                        {/* Hover Glow */}
                        <span className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                    </button>
                ))}

                <div className="w-px h-6 bg-white/10 mx-2" />

                <button
                    onClick={onThemeToggle}
                    className="p-2 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                >
                    {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>
        </motion.div>
    );
};