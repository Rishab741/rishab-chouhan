'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, Sparkles, Download, Play } from 'lucide-react';
import { PortfolioData } from '../types';

export const Header: React.FC<{ portfolioData: PortfolioData }> = ({ portfolioData }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section 
            id="home"
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black pt-20"
        >
            {/* Animated Background Grid */}
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
            <div className="absolute inset-0 bg-gradient-radial from-blue-900/10 via-transparent to-transparent" />

            {/* Floating Orbs */}
            <motion.div 
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div 
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]"
                animate={{
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.2, 1]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Column - Content */}
                    <div className="space-y-8">
                        
                        {/* Top Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/5 backdrop-blur-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-xs font-mono tracking-[0.2em] uppercase text-blue-400">
                                Open to Opportunities
                            </span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-6">
                                <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-600">
                                    {portfolioData.name.split(' ')[0]}
                                </span>
                                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                                    {portfolioData.name.split(' ')[1]}
                                </span>
                            </h1>

                            {/* Role with Accent */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-px w-12 bg-gradient-to-r from-blue-500 to-transparent"></div>
                                <h2 className="text-xl md:text-2xl font-semibold text-zinc-300">
                                    {portfolioData.role}
                                </h2>
                            </div>

                            <p className="text-sm font-mono tracking-[0.15em] uppercase text-zinc-500 flex items-center gap-2">
                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                {portfolioData.contact.location.split(',')[0]} • Full-Stack & Blockchain
                            </p>
                        </motion.div>

                        {/* Bio */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg text-zinc-400 leading-relaxed max-w-xl"
                        >
                            {portfolioData.bio}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-wrap items-center gap-4"
                        >
                            <a
                                href={`mailto:${portfolioData.contact.email}`}
                                className="group relative px-8 py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-all overflow-hidden shadow-lg hover:shadow-white/20"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get In Touch
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                            </a>
                            
                            <button
                                onClick={() => document.getElementById('projects')?.scrollIntoView({behavior: 'smooth'})}
                                className="group px-8 py-4 bg-white/5 border border-white/10 rounded-full font-bold hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm flex items-center gap-2"
                            >
                                View Work
                                <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex items-center gap-3 pt-4"
                        >
                            <span className="text-sm text-zinc-500 font-medium mr-2">Connect:</span>
                            {[
                                { icon: Github, href: portfolioData.contact.github, label: 'GitHub' },
                                { icon: Linkedin, href: portfolioData.contact.linkedin, label: 'LinkedIn' },
                                { icon: Mail, href: `mailto:${portfolioData.contact.email}`, label: 'Email' },
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <social.icon className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                                    <span className="sr-only">{social.label}</span>
                                    
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.a>
                            ))}
                        </motion.div>

                    </div>

                    {/* Right Column - Stats/Highlights */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="hidden lg:block"
                    >
                        <div className="relative">
                            {/* Bento Grid Layout */}
                            <div className="grid grid-cols-2 gap-4">
                                
                                {/* Large Feature Card */}
                                <div className="col-span-2 group relative p-8 bg-gradient-to-br from-zinc-900/50 to-zinc-900/20 border border-white/10 rounded-3xl backdrop-blur-xl hover:border-blue-500/30 transition-all duration-500">
                                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-700" />
                                    <div className="relative">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                                <Sparkles className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-400">
                                                    2+ Years
                                                </div>
                                                <div className="text-sm text-zinc-500 font-mono uppercase tracking-wider">
                                                    Experience
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-zinc-400 leading-relaxed">
                                            Building scalable solutions across blockchain, AI, and full-stack development
                                        </p>
                                    </div>
                                </div>

                                {/* Stat Card 1 */}
                                <div className="group relative p-6 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-xl hover:bg-zinc-800/40 hover:border-blue-500/20 transition-all duration-500">
                                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-700" />
                                    <div className="relative">
                                        <div className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-400 group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                                            3
                                        </div>
                                        <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                                            Startups<br/>Scaled
                                        </div>
                                    </div>
                                </div>

                                {/* Stat Card 2 */}
                                <div className="group relative p-6 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-xl hover:bg-zinc-800/40 hover:border-purple-500/20 transition-all duration-500">
                                    <div className="absolute -inset-1 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-700" />
                                    <div className="relative">
                                        <div className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white to-zinc-400 group-hover:from-purple-400 group-hover:to-pink-400 transition-all">
                                            80%
                                        </div>
                                        <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">
                                            Efficiency<br/>Gain
                                        </div>
                                    </div>
                                </div>

                                {/* Tech Stack Preview */}
                                <div className="col-span-2 group relative p-6 bg-zinc-900/30 border border-white/5 rounded-3xl backdrop-blur-xl hover:border-white/10 transition-all duration-500">
                                    <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-4">
                                        Core Tech Stack
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {['React', 'TypeScript', 'Node.js', 'Solidity', 'Python', 'AWS'].map((tech, i) => (
                                            <span 
                                                key={i}
                                                className="px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/10 rounded-full text-zinc-400 hover:text-white hover:border-blue-500/30 transition-all cursor-default"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />
                        </div>
                    </motion.div>

                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="flex flex-col items-center gap-2"
                    >
                        <span className="text-xs font-mono tracking-[0.3em] uppercase text-zinc-500">
                            Scroll
                        </span>
                        <div className="w-px h-16 bg-gradient-to-b from-zinc-500 to-transparent" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};