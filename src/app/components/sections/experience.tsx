'use client';

import React from 'react';
import { PortfolioData } from '../types';
import { AnimatedSection, SectionHeader } from '../ui';

interface ExperienceProps {
    portfolioData: PortfolioData;
}

export const Experience: React.FC<ExperienceProps> = ({ portfolioData }) => (
    <section id="experience" className="container mx-auto px-6 max-w-7xl py-24 lg:py-36">
        <SectionHeader subtitle="Career" title="Professional" highlight="Journey" />

        <div className="relative max-w-4xl mx-auto">
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

                    <div className="absolute left-8 md:left-1/2 top-8 md:top-1/2 w-8 h-8 bg-white dark:bg-gray-900 rounded-full shadow-lg md:-translate-x-1/2 md:-translate-y-1/2 z-20 border-4 border-purple-500 flex items-center justify-center group hover:scale-125 transition-all duration-300">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </div>

                    <div className="md:w-1/2"></div>
                </AnimatedSection>
            ))}
        </div>
    </section>
);
export default Experience;