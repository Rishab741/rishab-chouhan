import { useState, useEffect, useRef } from 'react';

export const useScrollProgress = () => {
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

export const useInView = (threshold = 0.1) => {
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold }
        );
        
        const currentRef = ref.current;
        if (currentRef) observer.observe(currentRef);
        
        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [threshold]);
    
    return [ref, inView] as const;
};

export const useDarkMode = (): [string, () => void] => {
    const [theme, setTheme] = useState('dark');
    
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);
    
    const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    return [theme, toggleTheme];
};

export const useTypingEffect = (text: string, speed = 100, delay = 500) => {
    const [displayedText, setDisplayedText] = useState('');
    
    useEffect(() => {
        setDisplayedText('');
        const cleanText = String(text).trim();
        let i = 0;
        
        const startTyping = setTimeout(() => {
            const typingInterval = setInterval(() => {
                if (i < cleanText.length) {
                    setDisplayedText(cleanText.substring(0, i + 1));
                    i++;
                } else {
                    clearInterval(typingInterval);
                }
            }, speed);
            
            return () => clearInterval(typingInterval);
        }, delay);
        
        return () => clearTimeout(startTyping);
    }, [text, speed, delay]);
    
    return displayedText;
};