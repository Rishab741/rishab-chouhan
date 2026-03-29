'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { PortfolioData } from '../types';

export const Experience: React.FC<{ portfolioData: PortfolioData }> = ({ portfolioData }) => {
    return (
        <section id="experience" className="py-32 relative overflow-hidden">
            {/* Background Elements */}
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

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-2 text-xs font-mono tracking-[0.3em] uppercase border border-purple-500/30 rounded-full text-purple-400 bg-purple-500/5 mb-6">
                        Career Path
                    </span>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-600">
                            Professional
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            Journey
                        </span>
                    </h2>
                    <p className="text-zinc-500 font-mono text-sm uppercase tracking-[0.3em]">
                        {portfolioData.experience.length} Key Milestones
                    </p>
                </motion.div>

                {/* Timeline Grid */}
                <div className="relative">
                    {/* Vertical Timeline Line - Desktop Only */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/30 via-purple-500/30 to-pink-500/30 -translate-x-1/2" />

                    <div className="space-y-8 md:space-y-16">
                        {portfolioData.experience.map((job, index) => (
                            <ExperienceCard 
                                key={index}
                                job={job}
                                index={index}
                                isEven={index % 2 === 0}
                            />
                        ))}
                    </div>
                </div>

                
            </div>
        </section>
    );
};

interface ExperienceCardProps {
    job: { role: string; company: string; duration: string; description: string };
    index: number;
    isEven: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ job, index, isEven }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start 0.7", "end 0.3"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 25
    });

    const opacity = useTransform(smoothProgress, [0, 0.3], [0, 1]);
    const scale = useTransform(smoothProgress, [0, 0.3], [0.9, 1]);
    const x = useTransform(smoothProgress, [0, 0.3], [isEven ? -50 : 50, 0]);
    const xReversed = useTransform(x, (val: number) => -val);
    const dotScale = useTransform(smoothProgress, [0.2, 0.4], [0, 1]);
    const numOpacity = useTransform(smoothProgress, [0.2, 0.4], [0, 0.05]);

    return (
        <motion.div
            ref={cardRef}
            style={{ opacity, scale }}
            className={`relative grid md:grid-cols-2 gap-8 items-center ${
                isEven ? '' : 'md:direction-rtl'
            }`}
        >
            {/* Timeline Dot */}
            <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <motion.div
                    className="relative"
                    style={{ scale: dotScale }}
                >
                    <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-ping opacity-75" />
                </motion.div>
            </div>

            {/* Content Card */}
            <motion.div
                style={{ x: isEven ? x : xReversed }}
                className={`${isEven ? 'md:text-right' : 'md:text-left md:[direction:ltr]'} ${
                    isEven ? '' : 'md:col-start-2'
                }`}
            >
                <div className="group relative p-8 bg-gradient-to-br from-zinc-900/50 to-zinc-900/20 border border-white/10 rounded-[2.5rem] backdrop-blur-2xl hover:border-purple-500/30 transition-all duration-500">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-700" />
                    
                    <div className="relative">
                        {/* Duration Badge */}
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4 ${
                            isEven ? 'md:float-right md:ml-4' : 'md:float-left md:mr-4'
                        }`}>
                            <Calendar className="w-3.5 h-3.5 text-purple-400" />
                            <span className="text-xs font-mono text-purple-400 tracking-wider">
                                {job.duration}
                            </span>
                        </div>

                        {/* Company Badge */}
                        <div className="mb-3">
                            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] bg-white/5 border border-white/10 rounded-full text-zinc-400 group-hover:border-purple-500/30 transition-colors">
                                {job.company}
                            </span>
                        </div>

                        {/* Role */}
                        <h3 className="text-2xl md:text-3xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-400 group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                            {job.role}
                        </h3>

                        {/* Description */}
                        <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                            {job.description}
                        </p>

                        {/* Decorative Corner Element */}
                        <div className={`absolute ${isEven ? 'top-6 right-6' : 'top-6 left-6'} w-12 h-12 border-t-2 border-r-2 border-purple-500/10 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                </div>
            </motion.div>

            {/* Visual Timeline Number */}
            <div className={`hidden md:block ${isEven ? 'md:col-start-2' : 'md:col-start-1'} ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                <motion.div
                    style={{ opacity: numOpacity }}
                    className="text-[120px] font-black leading-none select-none"
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-white/5 to-transparent">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                </motion.div>
            </div>
        </motion.div>
    );
};