'use client';

import React from 'react';
import { Dna, Cpu, Database, Cloud, Code } from 'lucide-react';
import { PortfolioData } from '../types';
import { AnimatedSection, SectionHeader } from '../ui';

const getSkillIcon = (skill: string) => {
    const s = skill.toLowerCase();
    if (s.includes('react') || s.includes('next')) return <Dna className="w-8 h-8" />;
    if (s.includes('node') || s.includes('express')) return <Cpu className="w-8 h-8" />;
    if (s.includes('mongo') || s.includes('postgre')) return <Database className="w-8 h-8" />;
    if (s.includes('aws') || s.includes('cloud')) return <Cloud className="w-8 h-8" />;
    if (s.includes('solidity') || s.includes('blockchain')) return <Code className="w-8 h-8" />;
    return <Code className="w-8 h-8" />;
};

const SkillBadge = ({ skill, delay, orbitRadius, angle }: any) => {
    const colors: any = {
        'ReactJS': 'from-blue-400 to-cyan-500',
        'TypeScript': 'from-blue-500 to-indigo-600',
        'NextJS': 'from-gray-300 to-gray-400',
        'Flutter': 'from-blue-400 to-blue-500',
        'Dart': 'from-blue-600 to-blue-700',
        'NodeJS': 'from-green-400 to-emerald-500',
        'PHP': 'from-purple-400 to-indigo-500',
        'Kafka': 'from-red-400 to-red-600',
        'NestJS': 'from-red-500 to-pink-600',
        'Python': 'from-blue-400 to-yellow-400',
        'Kotlin': 'from-purple-500 to-violet-600',
        'Java': 'from-orange-500 to-red-500',
        'Spring Boot': 'from-green-500 to-emerald-600',
        'PostgreSQL': 'from-blue-600 to-blue-700',
        'MongoDB': 'from-green-500 to-lime-500',
        'AWS': 'from-orange-400 to-yellow-500',
        'GCP': 'from-red-400 to-yellow-500',
        'Docker': 'from-blue-400 to-blue-500',
        'Linux': 'from-yellow-600 to-orange-600',
        'Solidity': 'from-purple-400 to-pink-500',
        'zkSync': 'from-purple-600 to-purple-800',
        'IPFS': 'from-teal-400 to-cyan-500',
        'C': 'from-slate-500 to-slate-700',
        'C++': 'from-blue-600 to-cyan-600',
    };

    const findGradient = (skillName: string) => {
        for (let key in colors) {
            if (skillName.includes(key)) return colors[key];
        }
        return 'from-purple-400 to-pink-500';
    };

    const gradient = findGradient(skill);

    return (
        <div
            className="absolute"
            style={{
                animation: `orbit ${8 + Math.random() * 4}s linear infinite`,
                '--radius': `${orbitRadius}px`,
                '--angle': `${angle}deg`,
                '--delay': `${delay}ms`,
            } as any}
        >
            <div className="group cursor-pointer">
                <div className="relative w-14 h-14 flex items-center justify-center">
                    <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-full opacity-0 blur-xl group-hover:opacity-60 transition-opacity duration-500`}></div>
                    
                    <div className={`relative w-full h-full bg-gradient-to-br ${gradient} rounded-full shadow-2xl border border-white/20 flex items-center justify-center transform transition-all duration-300 group-hover:scale-125 group-hover:shadow-2xl overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
                        
                        <div className="relative z-10 text-white text-xl">
                            {getSkillIcon(skill)}
                        </div>
                    </div>

                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 border border-purple-500/50 rounded-lg text-xs font-semibold text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                        {skill}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SkillOrbital = ({ skills }: { skills: string[] }) => {
    return (
        <div className="relative w-full aspect-square max-w-2xl mx-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative">
                    <div className="absolute -inset-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-40"></div>
                    
                    <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 rounded-full shadow-2xl border-2 border-white/30 flex items-center justify-center">
                        <div className="text-4xl">✨</div>
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-48 h-48 border border-purple-500/20 rounded-full"></div>
                <div className="absolute w-80 h-80 border border-purple-500/10 rounded-full"></div>
            </div>

            {skills.map((skill, index) => {
                const total = skills.length;
                const angle = (index / total) * 360;
                const orbitRadius = 120 + (index % 2) * 60;
                const delay = index * 100;
                return (
                    <div key={skill} className="absolute inset-0 flex items-center justify-center">
                        <SkillBadge skill={skill} delay={delay} orbitRadius={orbitRadius} angle={angle} />
                    </div>
                );
            })}
        </div>
    );
};

interface SkillsProps {
    portfolioData: PortfolioData;
}

export const Skills: React.FC<SkillsProps> = ({ portfolioData }) => {
    const allSkills = Object.values(portfolioData.skills).flat();
    
    return (
        <section id="skills" className="container mx-auto px-6 max-w-7xl py-24 lg:py-36">
            <SectionHeader subtitle="Expertise" title="Technical" highlight="Arsenal" />

            <AnimatedSection className="mb-24">
                <SkillOrbital skills={allSkills.slice(0, 12)} />
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