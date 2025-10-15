'use client';

import React from 'react';
import { useInView } from '../hooks';

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({ 
    children, 
    className = "", 
    delay = 0 
}) => {
    const [ref, inView] = useInView(0.1);
    
    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};
export default AnimatedSection;