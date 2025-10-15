'use client';

import React from 'react';
import { PortfolioData } from '../types';
import { AnimatedSection, SectionHeader } from '../ui';
// Import the animation component from its correct location
import { SkillConstellation } from '../SkillConstellation';

interface SkillsProps {
    portfolioData: PortfolioData;
}

// This is the named export 'Skills' that your layout needs
export const Skills: React.FC<SkillsProps> = ({ portfolioData }) => {
    // Process the data to get a flat array of skills
    const allSkills = Object.values(portfolioData.skills).flat();
    
    return (
        <section id="skills" className="container mx-auto px-6 max-w-7xl py-24 lg:py-36">
            <SectionHeader subtitle="Expertise" title="Technical" highlight="Arsenal" />

            {/* This section contains the animation */}
            <AnimatedSection className="mb-24">
                <SkillConstellation skills={allSkills.slice(0, 16)} />
            </AnimatedSection>
            
            {/* This section contains the categorized lists of skills */}
            <div className="space-y-16">
                {Object.entries(portfolioData.skills).map(([category, skills], i) => (
                    <AnimatedSection key={category} delay={i * 200}>
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text inline-block relative">
                                {category}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-50"></div>
                            </h3>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            {skills.map((skill) => (
                                <div
                                    key={skill}
                                    className="px-6 py-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-xl rounded-full border border-blue-200/30 dark:border-blue-700/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-default group"
                                >
                                    <span className="text-blue-700 dark:text-purple-200 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text font-semibold transition-all duration-300">
                                        {skill}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                ))}
            </div>
        </section>
    );
};