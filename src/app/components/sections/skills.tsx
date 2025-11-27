'use client';

import React from 'react';
import { motion } from 'framer-motion';

// FIX: Correct Relative Imports based on your provided paths
import { PortfolioData } from '../types'; 
import { SectionTitle } from '../ui/DesignSystem';
import { SkillConstellation } from '../SkillConstellation';

const SkillCategory = ({ category, skills, index }: { category: string; skills: string[], index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        viewport={{ once: true }}
        className="relative"
    >
        <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 font-mono pl-4">
            {category}
        </h3>
        <div className="flex flex-wrap gap-2 pl-4">
            {skills.map(skill => (
                <span 
                    key={skill}
                    className="px-3 py-1.5 text-sm text-gray-300 bg-white/5 border border-white/5 rounded hover:border-white/20 hover:text-white hover:bg-white/10 transition-all cursor-default"
                >
                    {skill}
                </span>
            ))}
        </div>
    </motion.div>
);

interface SkillsProps {
    portfolioData: PortfolioData;
}

export const Skills: React.FC<SkillsProps> = ({ portfolioData }) => {
    // Flatten skills to pass to the constellation physics engine
    const allSkills = Object.values(portfolioData.skills).flat();

    return (
        <section id="skills" className="py-32 relative">
            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* Section Header from DesignSystem */}
                <SectionTitle 
                    title="Technical Stack" 
                    subtitle="Capabilities" 
                />

                <div className="grid lg:grid-cols-3 gap-12 lg:gap-24">
                    {/* Left: The Interactive Constellation (Imported Component) */}
                    <div className="lg:col-span-2">
                        <SkillConstellation skills={allSkills} />
                    </div>

                    {/* Right: The Structured List */}
                    <div className="space-y-12 py-8">
                        {Object.entries(portfolioData.skills).map(([category, skills], i) => (
                            <SkillCategory 
                                key={category} 
                                category={category} 
                                skills={skills} 
                                index={i} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};