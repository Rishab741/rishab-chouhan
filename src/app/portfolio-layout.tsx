'use client';

import React, { useState, useEffect, useRef } from 'react';

// --- TYPE DEFINITIONS ---
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
    liveUrl: string;
    repoUrl: string;
  }[];
  education: {
    degree: string;
    institution: string;
    duration: string;
  }[];
}

// --- SVG ICONS ---
type IconProps = { className?: string };
const SunIcon = ({ className }: IconProps) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>);
const MoonIcon = ({ className }: IconProps) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>);
const BotIcon = ({ className }: IconProps) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>);
const SendIcon = ({ className }: IconProps) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>);
const CloseIcon = ({ className }: IconProps) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const GraduationCapIcon = ({ className }: IconProps) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>);
const BriefcaseIcon = ({ className }: IconProps) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>);
const CodeIcon = ({ className }: IconProps) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>);
const ExternalLinkIcon = ({ className }: IconProps) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>);
const GithubIcon = ({ className }: IconProps) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>);
const MailIcon = ({ className }: IconProps) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7L22 7"/></svg>);
const LinkedinIcon = ({ className }: IconProps) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>);

// --- INTERSECTION OBSERVER HOOK ---
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

// --- THEME TOGGLE HOOK ---
const useDarkMode = (): [string, () => void] => {
    const [theme, setTheme] = useState('dark');
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);
    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    return [theme, toggleTheme];
};

// --- DATA FETCHING HOOK ---
const usePortfolioData = () => {
    const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/data/Portfoliodata.json');
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setPortfolioData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                console.error('Error fetching portfolio data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { portfolioData, loading, error };
};

// --- CHATBOT COMPONENT ---
interface Message { from: 'user' | 'bot'; text: string; }
const Chatbot = ({ portfolioData }: { portfolioData: PortfolioData | null }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([ 
        { from: 'bot', text: `Hello! I'm ${portfolioData?.name || 'Rishab'}'s AI assistant. Ask me anything about skills, projects, or experience.` } 
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => { 
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading || !portfolioData) return;
        
        const userMessage: Message = { from: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Simulate AI response for demo
        setTimeout(() => {
            const responses = [
                "I have extensive experience in full-stack development, particularly with React, Node.js, and blockchain technologies.",
                "My latest project involves building a DeFi trading platform with advanced analytics capabilities.",
                "I'm currently pursuing my Master's at the University of Sydney while working as a Founding Engineer at Adina Labs.",
                "I specialize in modern web technologies including React, TypeScript, and cloud infrastructure on AWS."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setMessages(prev => [...prev, { from: 'bot', text: randomResponse }]);
            setIsLoading(false);
        }, 1000);
    };
    
    return (
        <>
            <button 
                onClick={() => setIsOpen(true)} 
                className={`fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/25 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-500 transform hover:scale-110 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`} 
                aria-label="Open AI Assistant"
            > 
                <BotIcon className="w-8 h-8" /> 
            </button> 

            <div className={`fixed bottom-0 right-0 sm:m-8 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/20 w-full sm:max-w-md h-[85vh] sm:h-[75vh] flex flex-col transition-all duration-700 ease-out transform ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-full scale-95'}`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-t-2xl sm:rounded-t-2xl">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                            <BotIcon className="w-5 h-5 text-white"/>
                        </div>
                        <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">AI Assistant</h3>
                    </div> 
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" 
                        aria-label="Close chat"
                    >
                        <CloseIcon className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
                    </button> 
                </div> 

                <div className="flex-1 p-6 overflow-y-auto space-y-6"> 
                    {messages.map((msg, i) => ( 
                        <div key={i} className={`flex items-end gap-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}> 
                            {msg.from === 'bot' && (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <BotIcon className="w-5 h-5 text-white"/>
                                </div>
                            )} 
                            <div className={`max-w-xs md:max-w-sm px-4 py-3 rounded-2xl shadow-lg ${msg.from === 'user' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-200/50 dark:border-gray-700/50'}`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                            </div> 
                        </div> 
                    ))} 
                    {isLoading && (
                        <div className="flex items-end gap-3 justify-start animate-fadeIn">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <BotIcon className="w-5 h-5 text-white"/>
                            </div>
                            <div className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 rounded-bl-md border border-gray-200/50 dark:border-gray-700/50">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        </div>
                    )} 
                    <div ref={messagesEndRef} /> 
                </div> 

                <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50"> 
                    <div className="relative">
                        <input 
                            type="text" 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            placeholder="Ask about projects, skills..." 
                            className="w-full pl-4 pr-14 py-4 bg-white dark:bg-gray-900 border border-gray-300/50 dark:border-gray-600/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 dark:text-gray-200 shadow-sm transition-all duration-300" 
                            disabled={isLoading} 
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()} 
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                        >
                            <SendIcon className="w-5 h-5"/>
                        </button>
                    </div> 
                </form> 
            </div> 
        </>
    );
};

// --- ANIMATED COMPONENTS ---
const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    const [ref, inView] = useInView(0.1);
    return (
        <div 
            ref={ref} 
            className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
        >
            {children}
        </div>
    );
};

const Section = ({ id, children }: { id: string, children: React.ReactNode }) => (
    <section id={id} className="container mx-auto px-6 max-w-7xl py-24 lg:py-36">
        <AnimatedSection>{children}</AnimatedSection>
    </section>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-4xl lg:text-6xl font-black text-center bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent mb-16 lg:mb-24 tracking-tight">
        {children}
    </h2>
);

const GlowCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
    const [ref, inView] = useInView(0.1);
    return (
        <div 
            ref={ref}
            className={`relative group transition-all duration-700 transform ${inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/20 dark:border-gray-700/20 overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 group-hover:border-purple-500/20">
                {children}
            </div>
        </div>
    );
};

// --- PAGE SECTIONS ---
const Navbar = ({ portfolioData, onThemeToggle, currentTheme }: { portfolioData: PortfolioData, onThemeToggle: () => void, currentTheme: string }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const navLinks = ['About', 'Skills', 'Experience', 'Projects', 'Education', 'Contact'];

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Show/hide navbar based on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsHidden(true); // Hide when scrolling down
            } else {
                setIsHidden(false); // Show when scrolling up
            }
            
            // Change background when scrolled
            setIsScrolled(currentScrollY > 50);
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id.toLowerCase());
        if (element) {
            // Calculate the position considering navbar height
            const navbarHeight = 76; // Approximate height of your navbar
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navbarHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <nav className={`fixed top-0 z-50 w-full transition-all duration-500 transform ${isHidden ? '-translate-y-full' : 'translate-y-0'} ${isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl shadow-xl border-b border-gray-200/20 dark:border-gray-700/20' : 'bg-transparent'}`}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center max-w-7xl">
                <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                    {portfolioData.name}
                </button>
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map(link => 
                        <button 
                            key={link} 
                            onClick={() => scrollToSection(link)} 
                            className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-semibold relative group"
                        >
                            {link}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                        </button>
                    )}
                </div>
                <button 
                    onClick={onThemeToggle} 
                    className="p-3 rounded-2xl hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20" 
                    aria-label="Toggle theme"
                >
                    {currentTheme === 'dark' ? 
                        <SunIcon className="w-6 h-6 text-yellow-500"/> : 
                        <MoonIcon className="w-6 h-6 text-gray-700"/>
                    }
                </button>
            </div>
        </nav>
    );
};

const Header = ({ portfolioData }: { portfolioData: PortfolioData }) => (
    <header id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-purple-950/20">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="container mx-auto px-6 text-center max-w-7xl relative z-10">
            <AnimatedSection>
                <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
                    <span className="block text-gray-900 dark:text-white mb-4">Hello, I'm</span>
                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                        {portfolioData.name.split(' ')[0]}
                    </span>
                </h1>
                <h2 className="text-2xl md:text-4xl font-bold text-gray-700 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                    {portfolioData.role}
                </h2>
                <p className="max-w-3xl mx-auto text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed">
                    {portfolioData.bio}
                </p>
                <div className="flex justify-center gap-6 flex-wrap">
                    <button 
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} 
                        className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
                    >
                        <span className="relative z-10">Get In Touch</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </button>
                    <button 
                        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} 
                        className="px-8 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-gray-300/50 dark:border-gray-700/50 text-gray-800 dark:text-gray-100 font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
                    >
                        View My Work
                    </button>
                </div>
            </AnimatedSection>
        </div>
    </header>
);

const About = () => (
    <Section id="about">
        <div className="grid lg:grid-cols-5 gap-16 items-center">
            <div className="lg:col-span-2">
                <AnimatedSection>
                    <div className="relative w-full max-w-md mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                        <div className="relative w-80 h-80 mx-auto rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-700">
                            <div className="w-72 h-72 rounded-full bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm flex items-center justify-center">
                                <CodeIcon className="w-32 h-32 text-white/90 animate-float" />
                            </div>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
            <div className="lg:col-span-3">
                <SectionTitle>About Me</SectionTitle>
                <AnimatedSection className="space-y-8">
                    <div className="space-y-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                        <p className="transform hover:translate-x-2 transition-transform duration-300">
                            Hello! I'm <span className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Rishab Chouhan</span>, a passionate software engineer with a strong foundation in full-stack development, blockchain technology, and artificial intelligence. With over two years of hands-on experience, I've had the privilege of being a core contributor to three Australian startups.
                        </p>
                        <p className="transform hover:translate-x-2 transition-transform duration-300 delay-100">
                            My expertise spans across modern web technologies, cloud infrastructure, and emerging technologies. I'm driven by innovation, love solving complex problems, and thrive in dynamic, fast-paced environments where continuous learning is essential.
                        </p>
                        <p className="transform hover:translate-x-2 transition-transform duration-300 delay-200">
                            Currently pursuing my Master's at the University of Sydney while working as a <span className="font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">Founding Engineer</span> at Adina Labs, focusing on cutting-edge blockchain solutions.
                        </p>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    </Section>
);

const Skills = ({ portfolioData }: { portfolioData: PortfolioData }) => (
    <Section id="skills">
        <SectionTitle>Technical Arsenal</SectionTitle>
        <div className="space-y-16">
            {Object.entries(portfolioData.skills).map(([category, skills], categoryIndex) => (
                <AnimatedSection key={category}>
                    <div className="relative">
                        <h3 className="text-3xl font-bold text-center mb-12 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                            {category}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {skills.map((skill, skillIndex) => (
                                <div 
                                    key={skill} 
                                    className="group relative transform transition-all duration-500 hover:scale-110"
                                    style={{ animationDelay: `${skillIndex * 100}ms` }}
                                >
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                                    <div className="relative bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 text-center group-hover:border-purple-500/50 transition-all duration-300">
                                        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                                            {skill}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </AnimatedSection>
            ))}
        </div>
    </Section>
);

const Experience = ({ portfolioData }: { portfolioData: PortfolioData }) => (
    <Section id="experience">
        <SectionTitle>Professional Journey</SectionTitle>
        <div className="relative max-w-5xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 md:-translate-x-1/2 opacity-30"></div>
            
            {portfolioData.experience.map((job, index) => (
                <AnimatedSection key={index}>
                    <div className={`relative pl-20 mb-16 md:flex md:items-center md:pl-0 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                        <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                            <GlowCard delay={index * 200}>
                                <div className="p-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                                        <p className="text-sm font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                                            {job.duration}
                                        </p>
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                        {job.role}
                                    </h3>
                                    <p className="text-xl font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-6">
                                        {job.company}
                                    </p>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {job.description}
                                    </p>
                                </div>
                            </GlowCard>
                        </div>
                        
                        {/* Timeline dot */}
                        <div className="absolute left-8 md:left-1/2 top-8 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg md:-translate-x-1/2 z-10 animate-pulse">
                            <div className="absolute inset-1 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                                <BriefcaseIcon className="w-3 h-3 text-purple-600"/>
                            </div>
                        </div>
                        
                        <div className="md:w-1/2"></div>
                    </div>
                </AnimatedSection>
            ))}
        </div>
    </Section>
);

const Projects = ({ portfolioData }: { portfolioData: PortfolioData }) => (
    <Section id="projects">
        <SectionTitle>Featured Projects</SectionTitle>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {portfolioData.projects.map((project, index) => (
                <GlowCard key={index} delay={index * 200}>
                    <div className="p-8 h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <CodeIcon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {project.title}
                            </h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.technologies.map(tech => (
                                <span 
                                    key={tech} 
                                    className="px-3 py-1 text-sm font-semibold bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-800 dark:text-blue-200 rounded-full border border-blue-200/50 dark:border-blue-700/50"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-grow">
                            {project.description}
                        </p>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-4 mb-6">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">My Contribution: </span>
                                {project.contribution}
                            </p>
                        </div>
                        
                        <div className="flex gap-4 mt-auto">
                            <a 
                                href={project.liveUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                            >
                                <ExternalLinkIcon className="w-4 h-4" />
                                Live Demo
                            </a>
                            <a 
                                href={project.repoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                            >
                                <GithubIcon className="w-4 h-4" />
                                Code
                            </a>
                        </div>
                    </div>
                </GlowCard>
            ))}
        </div>
    </Section>
);

const Education = ({ portfolioData }: { portfolioData: PortfolioData }) => (
    <Section id="education">
        <SectionTitle>Academic Background</SectionTitle>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            {portfolioData.education.map((edu, index) => (
                <GlowCard key={index} delay={index * 200}>
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                            <GraduationCapIcon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                            {edu.degree}
                        </h3>
                        <p className="text-xl font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-3">
                            {edu.institution}
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                            {edu.duration}
                        </p>
                    </div>
                </GlowCard>
            ))}
        </div>
    </Section>
);

const Contact = ({ portfolioData }: { portfolioData: PortfolioData }) => (
    <Section id="contact">
        <SectionTitle>Let's Connect</SectionTitle>
        <AnimatedSection>
            <div className="max-w-4xl mx-auto text-center">
                <p className="text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
                    I'm always excited to discuss new opportunities, innovative projects, or potential collaborations. Let's create something amazing together!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <GlowCard>
                        <a href={`mailto:${portfolioData.contact.email}`} className="block p-8 text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300">
                                <MailIcon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email</h3>
                            <p className="text-gray-600 dark:text-gray-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                                {portfolioData.contact.email}
                            </p>
                        </a>
                    </GlowCard>
                    
                    <GlowCard delay={100}>
                        <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="block p-8 text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300">
                                <LinkedinIcon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">LinkedIn</h3>
                            <p className="text-gray-600 dark:text-gray-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                                Connect with me
                            </p>
                        </a>
                    </GlowCard>
                    
                    <GlowCard delay={200}>
                        <a href={portfolioData.contact.github} target="_blank" rel="noopener noreferrer" className="block p-8 text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300">
                                <GithubIcon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">GitHub</h3>
                            <p className="text-gray-600 dark:text-gray-300 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                                View my code
                            </p>
                        </a>
                    </GlowCard>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 backdrop-blur-sm border border-blue-200/20 dark:border-blue-700/20">
                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
                        📍 {portfolioData.contact.location}
                    </p>
                    <p className="text-xl text-gray-700 dark:text-gray-300">
                        📞 {portfolioData.contact.phone}
                    </p>
                </div>
            </div>
        </AnimatedSection>
    </Section>
);

const Footer = ({ portfolioData }: { portfolioData: PortfolioData }) => (
    <footer className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
            <h3 className="text-3xl font-bold mb-4 text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                {portfolioData.name}
            </h3>
            <p className="text-lg text-gray-300 mb-8">
                © {new Date().getFullYear()} All rights reserved.
            </p>
            <p className="text-gray-400">
                Built with ❤️ using React, Next.js, and Tailwind CSS
            </p>
        </div>
    </footer>
);

const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300">Loading portfolio data...</p>
        </div>
    </div>
);

const ErrorMessage = ({ error }: { error: string }) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Data</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
                Try Again
            </button>
        </div>
    </div>
);

// --- MAIN CLIENT COMPONENT ---
export default function PortfolioClientLayout({ portfolioData }: { portfolioData: PortfolioData }) {
    const [theme, toggleTheme] = useDarkMode();
   ;
    
    
    
    return (
        <>
            <style jsx={true} global={true}>{`
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
                
                /* Scrollbar Styling */
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
            `}</style>
            
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-700 selection:bg-purple-500/30">
                <Navbar portfolioData={portfolioData} onThemeToggle={toggleTheme} currentTheme={theme} />
                <main>
                    <Header portfolioData={portfolioData} />
                    <About />
                    <Skills portfolioData={portfolioData} />
                    <Experience portfolioData={portfolioData} />
                    <Projects portfolioData={portfolioData} />
                    <Education portfolioData={portfolioData} />
                    <Contact portfolioData={portfolioData} />
                </main>
                <Footer portfolioData={portfolioData} />
                <Chatbot portfolioData={portfolioData} />
            </div>
        </>
    );
}