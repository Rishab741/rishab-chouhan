'use client';
import React, { useRef, useState } from 'react';
import { PortfolioData } from '../types';
import { SectionTitle } from '../ui/DesignSystem';

// --- Spotlight Card Component ---
const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => { setOpacity(1); };
    const handleBlur = () => { setOpacity(0); };
    const handleMouseEnter = () => { setOpacity(1); };
    const handleMouseLeave = () => { setOpacity(0); };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
};

export const Projects: React.FC<{ portfolioData: PortfolioData }> = ({ portfolioData }) => {
    return (
        <section id="projects" className="py-14 relative">
            <div className="container mx-auto px-6 max-w-7xl">
                <SectionTitle title="Featured Projects" subtitle="Portfolio" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {portfolioData.projects.map((project, index) => (
                        <SpotlightCard key={index} className="h-full group">
                            <div className="p-5 h-full flex flex-col">
                                {/* Top Area */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-2 flex-wrap">
                                        {project.technologies.slice(0, 3).map(tech => (
                                            <span key={tech} className="px-2 py-1 text-xs font-medium text-gray-400 bg-white/5 rounded-full border border-white/5">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow">
                                    {project.description}
                                </p>

                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </section>
    );
};