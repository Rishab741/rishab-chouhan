'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { PortfolioData } from '../types';
import { SectionTitle } from '../ui/DesignSystem';

export const Experience: React.FC<{ portfolioData: PortfolioData }> = ({ portfolioData }) => {
    return (
        <section id="experience" className="py-32 relative">
            <div className="container mx-auto px-6 max-w-5xl">
                <SectionTitle title="Professional Journey" subtitle="Experience" />

                <div className="relative">
                    {/* Continuous Vertical Line with Gradient */}
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-transparent md:-translate-x-1/2 opacity-30" />

                    <div className="space-y-12">
                        {portfolioData.experience.map((job, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative pl-8 md:pl-0 flex flex-col md:flex-row items-center gap-8 ${
                                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                }`}
                            >
                                {/* Timeline Node */}
                                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-black border-2 border-purple-500 rounded-full md:-translate-x-1/2 shadow-[0_0_10px_rgba(168,85,247,0.5)] z-10 mt-1.5 md:mt-0" />

                                {/* Content Card */}
                                <div className={`flex-1 w-full ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                    <div className="p-6 md:p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.05] transition-all group backdrop-blur-sm">
                                        <span className="inline-flex items-center gap-2 text-sm text-purple-400 font-mono mb-2">
                                            <Calendar size={14} />
                                            {job.duration}
                                        </span>
                                        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                                            {job.role}
                                        </h3>
                                        <div className="text-lg font-medium text-gray-400 mb-4">{job.company}</div>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {job.description}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Spacer for the other side */}
                                <div className="hidden md:block flex-1" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};