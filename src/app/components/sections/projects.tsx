'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import { Star } from 'lucide-react';
import { PortfolioData } from '../types';
import { AnimatedSection, SectionHeader } from '../ui';
import { useInView } from '../hooks';

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
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-pink-600/0 group-hover:from-blue-600/20 group-hover:via-purple-600/20 group-hover:to-pink-600/20 pointer-events-none"></div>

                <div
                    style={{
                        transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                        transition: 'transform 0.2s ease-out'
                    }}
                    className="p-8 flex flex-col h-full relative z-10"
                >
                    {index === 0 && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                            <Star size={14} className="fill-current" />
                            Featured
                        </div>
                    )}

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                        {project.title}
                    </h3>

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

                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-5 mt-auto border-l-4 border-purple-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 relative z-10">
                            <span className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">Contribution: </span>
                            {project.contribution}
                        </p>
                    </div>
                </div>

                <div className="absolute inset-0 bg-shimmer-gradient opacity-0 group-hover:opacity-20 animate-shimmer pointer-events-none"></div>
            </div>
        </AnimatedSection>
    );
};

interface ProjectsProps {
    portfolioData: PortfolioData;
}

export const Projects: React.FC<ProjectsProps> = ({ portfolioData }) => (
    <section id="projects" className="container mx-auto px-6 max-w-7xl py-24 lg:py-36">
        <SectionHeader subtitle="Portfolio" title="Featured" highlight="Projects" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.projects.map((project, index) => (
                <InteractiveProjectCard key={index} project={project} index={index} />
            ))}
        </div>
    </section>
);