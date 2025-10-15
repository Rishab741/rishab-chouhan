'use client';

import React from 'react';
import { AnimatedSection } from './animated-section';

interface SectionHeaderProps {
    subtitle: string;
    title: string;
    highlight: string;
    className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
    subtitle, 
    title, 
    highlight, 
    className = "" 
}) => (
    <AnimatedSection className={`text-center mb-20 ${className}`}>
        <div className="inline-block mb-6">
            <div className="px-5 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200/50 dark:border-blue-700/50">
                <p className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text uppercase tracking-wider">
                    {subtitle}
                </p>
            </div>
        </div>
        <h2 className="text-5xl lg:text-7xl font-black mb-6 text-gray-900 dark:text-white tracking-tight">
            {title} <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">{highlight}</span>
        </h2>
    </AnimatedSection>
);