'use client';

import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import {
    Sun, Moon, Bot, Send, X, GraduationCap, Briefcase, Code, Star,
    Github, Linkedin, Mail, ExternalLink, Cpu, Database, Cloud, Dna, ChevronDown
} from 'lucide-react';

export interface PortfolioData {
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

// --- INTERACTIVE MOUSE TRACKER ---
const useMousePosition = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: any) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return position;
};

// --- SCROLL PROGRESS HOOK ---
const useScrollProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / height) * 100;
            setProgress(scrolled);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return progress;
};

// --- HOOKS ---
const useInView = (threshold = 0.1) => {
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, inView] as const;
};

const useDarkMode = (): [string, () => void] => {
    const [theme, setTheme] = useState('dark');
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);
    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    return [theme, toggleTheme];
};

const useTypingEffect = (text: string, speed = 100, delay = 500) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayedText('');
        setIsComplete(false);
        
        // Ensure text is properly trimmed and clean
        const cleanText = String(text).trim();
        let i = 0;
        
        const startTyping = setTimeout(() => {
            const typingInterval = setInterval(() => {
                if (i < cleanText.length) {
                    setDisplayedText(cleanText.substring(0, i + 1));
                    i++;
                } else {
                    clearInterval(typingInterval);
                    setIsComplete(true);
                }
            }, speed);
            return () => clearInterval(typingInterval);
        }, delay);
        
        return () => clearTimeout(startTyping);
    }, [text, speed, delay]);

    return displayedText;
};

// --- UTILITY ---
const getSkillIcon = (skill: string) => {
    const s = skill.toLowerCase();
    if (s.includes('react') || s.includes('next')) return <Dna className="w-8 h-8" />;
    if (s.includes('node') || s.includes('express')) return <Cpu className="w-8 h-8" />;
    if (s.includes('mongo') || s.includes('postgre')) return <Database className="w-8 h-8" />;
    if (s.includes('aws') || s.includes('cloud')) return <Cloud className="w-8 h-8" />;
    if (s.includes('solidity') || s.includes('blockchain')) return <Code className="w-8 h-8" />;
    return <Code className="w-8 h-8" />;
};

// --- ANIMATED COMPONENTS ---
const AnimatedSection = ({ children, className = "", delay = 0 }: any) => {
    const [ref, inView] = useInView(0.1);
    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// --- INTERACTIVE SKILL CARD WITH 3D EFFECT ---
const InteractiveSkillCard = ({ skill }: { skill: string }) => {
    const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const rotateY = ((x / rect.width) - 0.5) * 20;
        const rotateX = ((0.5 - y / rect.height)) * 20;
        
        setTransform({ rotateX, rotateY });
    };

    const handleMouseLeave = () => {
        setTransform({ rotateX: 0, rotateY: 0 });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group h-24 perspective"
            style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
                transition: 'transform 0.1s ease-out'
            }}
        >
            <div className="relative w-full h-full bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-700/30 p-5 flex items-center justify-center group-hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 -z-10 transition-all duration-500 group-hover:blur-2xl"></div>
                
                <div className="relative z-10 flex items-center gap-3">
                    <div className="text-2xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                        {getSkillIcon(skill)}
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300 text-sm md:text-base">
                        {skill}
                    </span>
                </div>
            </div>
        </div>
    );
};

// --- INTERACTIVE PROJECT CARD WITH PARALLAX ---
const InteractiveProjectCard = ({ project, index }: { project: any; index: number }) => {
    const [ref, inView] = useInView(0.1);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
            x: (e.clientX - rect.left - rect.width / 2) * 0.15,
            y: (e.clientY - rect.top - rect.height / 2) * 0.15
        });
    };

    const handleMouseLeave = () => {
        setMousePos({ x: 0, y: 0 });
    };

    return (
        <AnimatedSection delay={index * 150}>
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative group bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-700/30 overflow-hidden transform transition-all duration-500 hover:shadow-2xl h-full"
            >
                {/* Animated border gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/20 group-hover:via-purple-600/20 group-hover:to-pink-600/20 pointer-events-none"></div>

                {/* Parallax content container */}
                <div
                    style={{
                        transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                        transition: 'transform 0.2s ease-out'
                    }}
                    className="p-8 flex flex-col h-full relative z-10"
                >
                    {/* Featured badge */}
                    {index === 0 && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                            <Star size={14} className="fill-current" />
                            Featured
                        </div>
                    )}

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                        {project.title}
                    </h3>

                    {/* Tech tags with staggered animation */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech: string, i: number) => (
                            <span
                                key={tech}
                                className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200/50 dark:border-blue-700/50 hover:scale-105 hover:shadow-md transition-all duration-300"
                                style={{ transitionDelay: `${i * 50}ms` }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-grow">
                        {project.description}
                    </p>

                    {/* Contribution box with left border accent */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-5 mt-auto border-l-4 border-purple-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 relative z-10">
                            <span className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Contribution: </span>
                            {project.contribution}
                        </p>
                    </div>
                </div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-shimmer-gradient opacity-0 group-hover:opacity-20 animate-shimmer pointer-events-none"></div>
            </div>
        </AnimatedSection>
    );
};

// --- SCROLL PROGRESS BAR ---
const ScrollProgressBar = () => {
    const progress = useScrollProgress();
    return (
        <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 z-50 transition-all duration-300" style={{ width: `${progress}%` }}></div>
    );
};

// --- NAVBAR ---
const Navbar = ({ portfolioData, onThemeToggle, currentTheme }: any) => {
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
            window.scrollTo({ top: elementPosition - navbarHeight, behavior: 'smooth' });
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

// --- HEADER WITH INTERACTIVE BACKGROUND ---
const Header = ({ portfolioData }: { portfolioData: PortfolioData }) => {
    const typedRole = useTypingEffect(portfolioData.role, 70, 500);
    const [ref, inView] = useInView(0.5);

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

                    {/* Scroll indicator */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
                        <ChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </div>
                </AnimatedSection>
            </div>
        </header>
    );
};

// --- SKILLS SECTION ---
const Skills = ({ portfolioData }: { portfolioData: PortfolioData }) => (
    <section id="skills" className="container mx-auto px-6 max-w-7xl py-24 lg:py-36">
        <AnimatedSection className="text-center mb-20">
            <div className="inline-block mb-6">
                <div className="px-5 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200/50 dark:border-blue-700/50">
                    <p className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text uppercase tracking-wider">
                        Expertise
                    </p>
                </div>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black mb-6 text-gray-900 dark:text-white tracking-tight">
                Technical <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">Arsenal</span>
            </h2>
        </AnimatedSection>

        <div className="space-y-16">
            {Object.entries(portfolioData.skills).map(([category, skills], i) => (
                <AnimatedSection key={category} delay={i * 200}>
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text inline-block relative">
                            {category}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-50"></div>
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {skills.map((skill, idx) => (
                            <div key={skill} style={{ transitionDelay: `${idx * 50}ms` }}>
                                <InteractiveSkillCard skill={skill} />
                            </div>
                        ))}
                    </div>
                </AnimatedSection>
            ))}
        </div>
    </section>
);

// --- PROJECTS SECTION ---
const Projects = ({ portfolioData }: { portfolioData: PortfolioData }) => (
    <section id="projects" className="container mx-auto px-6 max-w-7xl py-24 lg:py-36">
        <AnimatedSection className="text-center mb-20">
            <div className="inline-block mb-6">
                <div className="px-5 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200/50 dark:border-blue-700/50">
                    <p className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text uppercase tracking-wider">
                        Portfolio
                    </p>
                </div>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black mb-6 text-gray-900 dark:text-white">
                Featured <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">Projects</span>
            </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.projects.map((project, index) => (
                <InteractiveProjectCard key={index} project={project} index={index} />
            ))}
        </div>
    </section>
);

// --- EXPERIENCE SECTION ---
const Experience = ({ portfolioData }: { portfolioData: PortfolioData }) => (
    <section id="experience" className="container mx-auto px-6 max-w-7xl py-24 lg:py-36">
        <AnimatedSection className="text-center mb-20">
            <div className="inline-block mb-6">
                <div className="px-5 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200/50 dark:border-blue-700/50">
                    <p className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text uppercase tracking-wider">
                        Career
                    </p>
                </div>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black mb-6 text-gray-900 dark:text-white tracking-tight">
                Professional <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">Journey</span>
            </h2>
        </AnimatedSection>

        <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 md:-translate-x-1/2 opacity-30"></div>

            {portfolioData.experience.map((job, index) => (
                <AnimatedSection key={index} delay={index * 150} className={`relative pl-20 mb-16 md:flex md:items-stretch md:pl-0 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                        <div className="relative group bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-700/30 overflow-hidden transform hover:shadow-2xl transition-all duration-500 hover:border-purple-500/50 p-8">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-pink-600/10 pointer-events-none"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                                    <p className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text uppercase tracking-wide">
                                        {job.duration}
                                    </p>
                                </div>
                                
                                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                    {job.role}
                                </h3>
                                
                                <p className="text-lg lg:text-xl font-semibold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text mb-4">
                                    {job.company}
                                </p>
                                
                                <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 opacity-50"></div>
                                
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {job.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="absolute left-8 md:left-1/2 top-8 md:top-1/2 w-8 h-8 bg-white dark:bg-gray-900 rounded-full shadow-lg md:-translate-x-1/2 md:-translate-y-1/2 z-20 border-4 border-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center group hover:scale-125 transition-all duration-300">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </div>

                    <div className="md:w-1/2"></div>
                </AnimatedSection>
            ))}
        </div>
    </section>
);

// --- EDUCATION SECTION ---
const Education = ({ portfolioData }: { portfolioData: PortfolioData }) => (
    <section id="education" className="container mx-auto px-6 max-w-7xl py-24 lg:py-36">
        <AnimatedSection className="text-center mb-20">
            <div className="inline-block mb-6">
                <div className="px-5 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200/50 dark:border-blue-700/50">
                    <p className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text uppercase tracking-wider">
                        Education
                    </p>
                </div>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black mb-6 text-gray-900 dark:text-white tracking-tight">
                Academic <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">Background</span>
            </h2>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {portfolioData.education.map((edu, index) => (
                <AnimatedSection key={index} delay={index * 150}>
                    <div className="group relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-700/30 overflow-hidden transform hover:shadow-2xl transition-all duration-500 hover:border-purple-500/50 hover:scale-105 hover:-translate-y-1 p-8 text-center h-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/10 group-hover:via-purple-600/10 group-hover:to-pink-600/10 pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            {/* Icon */}
                            <div className="relative mx-auto mb-6 w-fit">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500"></div>
                                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                    <GraduationCap className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                {edu.degree}
                            </h3>

                            <p className="text-lg font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-3">
                                {edu.institution}
                            </p>

                            <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 mx-auto opacity-50"></div>

                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                                {edu.duration}
                            </p>
                        </div>
                    </div>
                </AnimatedSection>
            ))}
        </div>
    </section>
);
const Contact = ({ portfolioData }: { portfolioData: PortfolioData }) => (
    <section id="contact" className="container mx-auto px-6 max-w-7xl py-24 lg:py-36">
        <AnimatedSection className="text-center mb-20">
            <div className="inline-block mb-6">
                <div className="px-5 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200/50 dark:border-blue-700/50">
                    <p className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text uppercase tracking-wider">
                        Contact
                    </p>
                </div>
            </div>
            <h2 className="text-5xl lg:text-7xl font-black mb-6 text-gray-900 dark:text-white">
                Let's <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">Connect</span>
            </h2>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <AnimatedSection delay={0}>
                    <a
                        href={`mailto:${portfolioData.contact.email}`}
                        className="group relative h-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-700/30 p-8 text-center hover:shadow-2xl hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <Mail className="w-12 h-12 mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email</h3>
                            <p className="text-gray-600 dark:text-gray-300 break-all text-sm">{portfolioData.contact.email}</p>
                        </div>
                    </a>
                </AnimatedSection>

                <AnimatedSection delay={100}>
                    <a
                        href={portfolioData.contact.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative h-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-700/30 p-8 text-center hover:shadow-2xl hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <Linkedin className="w-12 h-12 mx-auto mb-4 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">LinkedIn</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Connect with me</p>
                        </div>
                    </a>
                </AnimatedSection>

                <AnimatedSection delay={200}>
                    <a
                        href={portfolioData.contact.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative h-full bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-700/30 p-8 text-center hover:shadow-2xl hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <Github className="w-12 h-12 mx-auto mb-4 text-pink-600 group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">GitHub</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">View my code</p>
                        </div>
                    </a>
                </AnimatedSection>
            </div>

            {/* Contact Info Box */}
            <AnimatedSection delay={300}>
                <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-xl rounded-2xl p-10 border border-blue-200/30 dark:border-blue-700/30 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 grid md:grid-cols-2 gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-3xl">📍</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">Location</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{portfolioData.contact.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-3xl">📞</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{portfolioData.contact.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
        </div>
    </section>
);

// --- FOOTER ---
const Footer = ({ portfolioData }: { portfolioData: PortfolioData }) => (
    <footer className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
                <AnimatedSection>
                    <div>
                        <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-4">
                            {portfolioData.name.split(' ')[0]}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{portfolioData.role}</p>
                    </div>
                </AnimatedSection>

                <AnimatedSection delay={100}>
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">Quick Links</h4>
                        <ul className="space-y-2">
                            {['About', 'Skills', 'Projects', 'Contact'].map(link => (
                                <li key={link}>
                                    <a href={`#${link.toLowerCase()}`} className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2">
                                        <span className="text-purple-500">→</span>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </AnimatedSection>

                <AnimatedSection delay={200}>
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">Follow</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href={portfolioData.contact.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2">
                                    <span className="text-purple-500">→</span>
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2">
                                    <span className="text-purple-500">→</span>
                                    LinkedIn
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${portfolioData.contact.email}`} className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center gap-2">
                                    <span className="text-purple-500">→</span>
                                    Email
                                </a>
                            </li>
                        </ul>
                    </div>
                </AnimatedSection>

                <AnimatedSection delay={300}>
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">Status</h4>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <p className="text-gray-300 text-sm">Available for opportunities</p>
                            </div>
                            <p className="text-gray-400 text-sm">Based in {portfolioData.contact.location}</p>
                        </div>
                    </div>
                </AnimatedSection>
            </div>

            <div className="border-t border-gray-700/50 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} {portfolioData.name}. All rights reserved.
                    </p>
                    <p className="text-gray-400 text-sm">
                        Built with React, Next.js, and Tailwind CSS
                    </p>
                </div>
            </div>
        </div>
    </footer>
);

// --- MAIN COMPONENT ---
export default function PortfolioClientLayout({ portfolioData }: { portfolioData: PortfolioData }) {
    const [theme, toggleTheme] = useDarkMode();

    return (
        <>
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

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                @keyframes blink {
                    from, to { color: transparent; }
                    50% { color: inherit; }
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

                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }

                .animate-shimmer {
                    animation: shimmer 2.5s infinite linear;
                }

                .typing-cursor::after {
                    content: '|';
                    animation: blink 1s step-end infinite;
                }

                .bg-shimmer-gradient {
                    background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.2) 50%, transparent 80%);
                }

                .dark .bg-shimmer-gradient {
                    background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.05) 50%, transparent 80%);
                }

                /* Scrollbar styling */
                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: ${theme === 'dark' ? '#1f2937' : '#f1f5f9'};
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #2563eb, #7c3aed);
                }

                /* Selection styling */
                ::selection {
                    background-color: rgba(139, 92, 246, 0.3);
                    color: inherit;
                }

                /* Perspective for 3D effects */
                .perspective {
                    perspective: 1000px;
                }
            `}</style>

            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-700 selection:bg-purple-500/30 overflow-x-hidden">
                <ScrollProgressBar />
                <Navbar portfolioData={portfolioData} onThemeToggle={toggleTheme} currentTheme={theme} />

                <main>
                    <Header portfolioData={portfolioData} />
                    <Skills portfolioData={portfolioData} />
                    <Experience portfolioData={portfolioData} />
                    <Projects portfolioData={portfolioData} />
                    <Education portfolioData={portfolioData} />
                    <Contact portfolioData={portfolioData} />
                </main>

                <Footer portfolioData={portfolioData} />
            </div>
        </>
    );
}