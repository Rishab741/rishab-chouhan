'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, useMotionValue, MotionValue } from 'framer-motion';

// FIX: Correct Relative Imports based on your provided paths
import { PortfolioData } from '../types'; 
import { SectionTitle } from '../ui/DesignSystem';
import { SkillConstellation } from '../SkillConstellation';

// Improved icon slug mapping
const getIconSlug = (skill: string) => {
  const map: Record<string, string> = {
    'reactjs': 'react',
    'nextjs': 'nextdotjs',
    'nodejs': 'nodedotjs',
    'postgresql': 'postgresql',
    'springboot': 'springboot',
    'gcp': 'googlecloud',
    'solidity': 'solidity',
    'scikit-learn': 'scikitlearn',
    'c++': 'cplusplus',
    'c#': 'csharp',
    'mongodb': 'mongodb',
    'aws': 'amazonaws',
    'docker': 'docker',
    'linux': 'linux',
    'typescript': 'typescript',
    'java': 'java',
    'python': 'python',
    'javascript': 'javascript',
    'tailwindcss': 'tailwindcss',
    'kubernetes': 'kubernetes',
    'graphql': 'graphql',
    'redis': 'redis',
    'git': 'git'
  };
  const s = skill.toLowerCase().trim().replace(/\s+/g, '');
  return map[s] || s;
};

interface SkillsProps {
    portfolioData: PortfolioData;
}

export const Skills: React.FC<SkillsProps> = ({ portfolioData }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Smooth spring physics for scroll - slower and more controlled
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 50,
        damping: 20,
        restDelta: 0.001
    });

    // Transform categories into an array for easier mapping
    const categories = Object.entries(portfolioData.skills);
    const totalSkills = categories.reduce((acc, [_, skills]) => acc + skills.length, 0);

    return (
        <section id="skills" ref={containerRef} className="relative py-48 bg-black overflow-hidden">
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" 
                     style={{
                         backgroundImage: `
                           linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
                         `,
                         backgroundSize: '80px 80px'
                     }} 
                />
            </div>

            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-blue-900/5 via-transparent to-transparent" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                
                {/* Scroll-Driven Header */}
                <motion.div 
                    className="text-center mb-32"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.div className="inline-block mb-6">
                        <span className="px-4 py-2 text-xs font-mono tracking-[0.3em] uppercase border border-blue-500/30 rounded-full text-blue-400 bg-blue-500/5">
                            Technical Arsenal
                        </span>
                    </motion.div>
                    
                    <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-600">
                            Skills &
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            Expertise
                        </span>
                    </h2>
                    
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Mastery across {totalSkills}+ technologies, frameworks, and platforms
                    </p>
                </motion.div>

                {/* The Main Skills Display */}
                <div className="space-y-20">
                    {categories.map(([category, skills], categoryIndex) => (
                        <SkillCategorySection
                            key={category}
                            category={category}
                            skills={skills}
                            categoryIndex={categoryIndex}
                            scrollProgress={smoothProgress}
                            totalCategories={categories.length}
                        />
                    ))}
                </div>

                {/* Constellation Background Integration */}
                <motion.div 
                    className="mt-32"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-200px" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <SkillConstellation skillsData={portfolioData.skills} />
                </motion.div>

            </div>
        </section>
    );
};

interface SkillCategorySectionProps {
    category: string;
    skills: string[];
    categoryIndex: number;
    scrollProgress: MotionValue<number>;
    totalCategories: number;
}

const SkillCategorySection: React.FC<SkillCategorySectionProps> = ({
    category,
    skills,
    categoryIndex,
}) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    
    // Individual scroll tracking for this specific section
    const { scrollYProgress: sectionProgress } = useScroll({
        target: sectionRef,
        offset: ["start 0.6", "end 0.4"] // Start animating when section is 60% down the viewport, end when 40% up
    });

    const smoothSectionProgress = useSpring(sectionProgress, {
        stiffness: 60,
        damping: 25
    });

    // Section-level animations based on viewport center
    const sectionOpacity = useTransform(
        smoothSectionProgress, 
        [0, 0.15, 0.85, 1], 
        [0, 1, 1, 0]
    );
    const sectionY = useTransform(smoothSectionProgress, [0, 0.25], [80, 0]);
    const sectionScale = useTransform(smoothSectionProgress, [0, 0.25, 0.85, 1], [0.95, 1, 1, 0.98]);

    return (
        <motion.div 
            ref={sectionRef}
            className="relative min-h-[80vh] flex items-center justify-center py-20"
            style={{
                opacity: sectionOpacity,
                y: sectionY,
                scale: sectionScale
            }}
        >
            <div className="w-full max-w-7xl mx-auto px-6">
            {/* Category Header with Animated Line */}
            <div className="flex items-center gap-6 mb-16">
                <motion.div 
                    className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                    style={{
                        width: useTransform(smoothSectionProgress, [0.05, 0.25], ['0%', '100%'])
                    }}
                />
                
                <motion.h3 
                    className="text-4xl md:text-5xl font-bold whitespace-nowrap"
                    style={{
                        opacity: useTransform(smoothSectionProgress, [0.05, 0.25], [0, 1]),
                        x: useTransform(smoothSectionProgress, [0.05, 0.25], [-30, 0])
                    }}
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                        {category}
                    </span>
                </motion.h3>
                
                <motion.div 
                    className="flex-1 h-px bg-gradient-to-r from-blue-500 to-transparent"
                    style={{
                        width: useTransform(smoothSectionProgress, [0.1, 0.3], ['0%', '100%'])
                    }}
                />
            </div>

            {/* Skills Grid with Staggered Reveal */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {skills.map((skill, skillIndex) => (
                    <SkillCard
                        key={skill}
                        skill={skill}
                        skillIndex={skillIndex}
                        totalSkills={skills.length}
                        categoryProgress={smoothSectionProgress}
                        startProgress={0}
                    />
                ))}
            </div>

            {/* Category Number Indicator */}
            <motion.div 
                className="absolute -left-6 top-0 text-9xl font-black opacity-5 pointer-events-none select-none"
                style={{
                    opacity: useTransform(smoothSectionProgress, [0.1, 0.3, 0.75, 0.9], [0, 0.08, 0.08, 0])
                }}
            >
                {String(categoryIndex + 1).padStart(2, '0')}
            </motion.div>
            </div>
        </motion.div>
    );
};

interface SkillCardProps {
    skill: string;
    skillIndex: number;
    totalSkills: number;
    categoryProgress: MotionValue<number>;
    startProgress: number;
}

const SkillCard: React.FC<SkillCardProps> = ({
    skill,
    skillIndex,
    totalSkills,
    categoryProgress,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Staggered reveal animation for each skill based on section progress
    const skillDelay = (skillIndex / totalSkills) * 0.25;
    const skillStartProgress = 0.2 + skillDelay;
    const skillEndProgress = skillStartProgress + 0.12;

    const opacity = useTransform(categoryProgress, [skillStartProgress, skillEndProgress], [0, 1]);
    const scale = useTransform(categoryProgress, [skillStartProgress, skillEndProgress], [0.8, 1]);
    const y = useTransform(categoryProgress, [skillStartProgress, skillEndProgress], [30, 0]);
    const rotateX = useTransform(categoryProgress, [skillStartProgress, skillEndProgress], [25, 0]);

    return (
        <motion.div
            ref={cardRef}
            className="group relative"
            style={{ 
                opacity, 
                scale, 
                y,
                rotateX,
                transformPerspective: 1000
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glow Effect on Hover */}
            <motion.div 
                className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                animate={{
                    opacity: isHovered ? 0.3 : 0
                }}
            />

            {/* Card */}
            <div className="relative h-full p-6 bg-zinc-900/50 border border-white/5 rounded-2xl backdrop-blur-xl hover:bg-zinc-800/50 hover:border-white/10 transition-all duration-300 cursor-default">
                
                {/* Icon */}
                <div className="mb-4 flex items-center justify-center">
                    <motion.div 
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors"
                        animate={{
                            rotate: isHovered ? [0, -10, 10, 0] : 0
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src={`https://cdn.simpleicons.org/${getIconSlug(skill)}/white`}
                            className="w-6 h-6 opacity-60 group-hover:opacity-100 transition-opacity"
                            alt={skill}
                            width={24}
                            height={24}
                            unoptimized
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </motion.div>
                </div>

                {/* Skill Name */}
                <h4 className="text-center text-sm font-semibold text-zinc-400 group-hover:text-white transition-colors">
                    {skill}
                </h4>

                {/* Animated Border on Hover */}
                <motion.div 
                    className="absolute inset-0 rounded-2xl"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)',
                        backgroundSize: '200% 100%'
                    }}
                    animate={{
                        backgroundPosition: isHovered ? ['0% 0%', '200% 0%'] : '0% 0%'
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: isHovered ? Infinity : 0,
                        ease: 'linear'
                    }}
                />
            </div>

            {/* Skill Index Number (Appears on Hover) */}
            <motion.div 
                className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                    scale: isHovered ? 1 : 0,
                    opacity: isHovered ? 1 : 0
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
                {skillIndex + 1}
            </motion.div>
        </motion.div>
    );
};