'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin } from 'lucide-react';
import { PortfolioData } from '../types';

export const Header: React.FC<{ portfolioData: PortfolioData }> = ({ portfolioData }) => {
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            <div className="container px-6 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    
                    {/* Floating Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Available for hire
                    </motion.div>

                    {/* Main Title with Gradient */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-9xl font-bold tracking-tight mb-8 text-white"
                    >
                        Building <br />
                        <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
                            Digital Futures
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        I'm {portfolioData.name.split(' ')[0]}. {portfolioData.bio}
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button onClick={() => document.getElementById('projects')?.scrollIntoView({behavior: 'smooth'})} className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all flex items-center gap-2">
                            View Work
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <div className="flex gap-4 px-6 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                            <SocialLink href={portfolioData.contact.github} icon={Github} />
                            <SocialLink href={portfolioData.contact.linkedin} icon={Linkedin} />
                            <SocialLink href={`mailto:${portfolioData.contact.email}`} icon={Download} />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const SocialLink = ({ href, icon: Icon }: any) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
        <Icon size={24} />
    </a>
);