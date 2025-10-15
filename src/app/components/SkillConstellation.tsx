'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Dna, Cpu, Database, Cloud, Code, Puzzle } from 'lucide-react';
import { PortfolioData } from './types';

// --- UI Components (Moved here to resolve path errors) ---

interface SectionHeaderProps {
    subtitle: string;
    title: string;
    highlight: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ subtitle, title, highlight }) => (
    <div className="text-center mb-16">
        <p className="text-lg font-semibold text-purple-500 mb-2">{subtitle}</p>
        <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-800 dark:text-white">
            {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">{highlight}</span>
        </h2>
        <div className="mt-4 w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
    </div>
);

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className, delay = 0 }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const variants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={variants}
            transition={{ duration: 0.6, delay: delay / 1000 }}
        >
            {children}
        </motion.div>
    );
};


// --- SkillConstellation Component ---

const getSkillStyle = (skill: string) => {
    const s = skill.toLowerCase();
    const iconProps = { className: "w-full h-full text-white/90" }; // Use full size for scaling
    
    let style = {
        Icon: () => <Puzzle {...iconProps} />,
        bgColor: 'bg-slate-700/80',
        glowColor: 'shadow-slate-500/50'
    };

    if (['react', 'next', 'javascript', 'typescript', 'flutter', 'dart'].some(tech => s.includes(tech))) {
        style.bgColor = 'bg-cyan-900/80'; style.glowColor = 'shadow-cyan-500/50'; style.Icon = () => <Dna {...iconProps} />;
    } else if (['node', 'express', 'nest', 'python', 'go', 'rust', 'java', 'kotlin', 'php', 'spring'].some(tech => s.includes(tech))) {
        style.bgColor = 'bg-indigo-900/80'; style.glowColor = 'shadow-indigo-500/50'; style.Icon = () => <Cpu {...iconProps} />;
    } else if (['mongo', 'postgre', 'kafka'].some(tech => s.includes(tech))) {
        style.bgColor = 'bg-green-900/80'; style.glowColor = 'shadow-green-500/50'; style.Icon = () => <Database {...iconProps} />;
    } else if (['aws', 'gcp', 'docker', 'kubernetes', 'linux', 'git'].some(tech => s.includes(tech))) {
        style.bgColor = 'bg-amber-900/80'; style.glowColor = 'shadow-amber-500/50'; style.Icon = () => <Cloud {...iconProps} />;
    } else if (['solidity', 'ipfs', 'ethereum', 'zksync', 'c++', 'c'].some(tech => s.includes(tech))) {
        style.bgColor = 'bg-violet-900/80'; style.glowColor = 'shadow-violet-500/50'; style.Icon = () => <Code {...iconProps} />;
    }

    return style;
};

interface SkillNodeProps {
    skill: string;
    x: number;
    y: number;
    size: number;
    isNearby: boolean;
}

const SkillNode: React.FC<SkillNodeProps> = ({ skill, x, y, size, isNearby }) => {
    const { Icon, bgColor, glowColor } = getSkillStyle(skill);
    const nodeSize = 64 * size;

    return (
        <motion.div
            className="absolute group cursor-pointer"
            initial={{ x: x - nodeSize / 2, y: y - nodeSize / 2, scale: 1 }}
            animate={{ x: x - nodeSize / 2, y: y - nodeSize / 2, scale: isNearby ? 1.25 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ width: nodeSize, height: nodeSize }}
        >
            <div className="relative w-full h-full flex items-center justify-center">
                <motion.div
                    className={`absolute inset-0 rounded-full blur-xl transition-all duration-300 ${isNearby ? glowColor : ''}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isNearby ? 0.7 : 0 }}
                />
                <div className={`relative w-[70%] h-[70%] ${bgColor} rounded-full shadow-lg border-2 border-white/10 flex items-center justify-center p-2 backdrop-blur-sm`}>
                    <div className="relative z-10 w-full h-full"><Icon /></div>
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900/80 border border-purple-500/50 rounded-lg text-xs font-semibold text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none z-30 backdrop-blur-sm">
                    {skill}
                </div>
            </div>
        </motion.div>
    );
};

interface SkillConstellationProps {
    skills: string[];
}

interface NodeState {
    id: number;
    skill: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
}

export const SkillConstellation: React.FC<SkillConstellationProps> = ({ skills }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const nodesRef = useRef<NodeState[]>([]);
    const mousePos = useRef({ x: 0, y: 0 });
    const [tick, setTick] = useState(0);
    
    // --- Physics and Animation Constants ---
    const MOUSE_REPEL_RADIUS = 150;
    const REPULSION_STRENGTH = 0.8;
    const DAMPING_FACTOR = 0.98;
    const NODE_CONNECTION_RADIUS = 120;

    useEffect(() => {
        const container = containerRef.current;
        if (!container || nodesRef.current.length > 0) return;
        nodesRef.current = skills.map((skill, i) => ({
            id: i, skill,
            x: Math.random() * container.clientWidth,
            y: Math.random() * container.clientHeight,
            vx: (Math.random() - 0.5) * 1.0, // Increased initial velocity
            vy: (Math.random() - 0.5) * 1.0,
            size: Math.random() * 0.6 + 0.7, // Size variation for parallax (0.7 to 1.3)
        }));
    }, [skills]);

    useEffect(() => {
        let animationFrameId: number;
        const container = containerRef.current;

        const updateMousePos = (e: MouseEvent) => {
            if (container) {
                const rect = container.getBoundingClientRect();
                mousePos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
            }
        };

        const animate = () => {
            if (container) {
                const { width, height } = container.getBoundingClientRect();
                const { x: mouseX, y: mouseY } = mousePos.current;

                nodesRef.current = nodesRef.current.map(node => {
                    let { x, y, vx, vy, size } = node;

                    // Mouse repulsion force
                    const dxMouse = x - mouseX;
                    const dyMouse = y - mouseY;
                    const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse) + 0.001; // Epsilon to prevent div by zero
                    
                    if (distMouse < MOUSE_REPEL_RADIUS) {
                        const force = (1 - distMouse / MOUSE_REPEL_RADIUS) * REPULSION_STRENGTH;
                        // Larger nodes are "heavier" and less affected by force
                        vx += (dxMouse / distMouse) * force / size;
                        vy += (dyMouse / distMouse) * force / size;
                    }

                    // Damping (friction)
                    vx *= DAMPING_FACTOR;
                    vy *= DAMPING_FACTOR;

                    // Update position
                    x += vx; 
                    y += vy;

                    // Wall collision with node radius
                    const nodeRadius = (64 * size) / 2;
                    if (x <= nodeRadius || x >= width - nodeRadius) {
                        vx *= -1;
                        x = Math.max(nodeRadius, Math.min(width - nodeRadius, x)); // Clamp position
                    }
                    if (y <= nodeRadius || y >= height - nodeRadius) {
                        vy *= -1;
                        y = Math.max(nodeRadius, Math.min(height - nodeRadius, y)); // Clamp position
                    }

                    return { ...node, x, y, vx, vy };
                });
            }
            setTick(t => t + 1);
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('mousemove', updateMousePos);
        animationFrameId = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', updateMousePos);
        };
    }, []);

    const nodes = nodesRef.current;

    return (
        <div ref={containerRef} className="relative w-full aspect-square max-w-3xl mx-auto border border-purple-500/10 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(168, 85, 247, 0.3)" />
                        <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                    </radialGradient>
                </defs>
                <circle cx={mousePos.current.x} cy={mousePos.current.y} r={MOUSE_REPEL_RADIUS} fill="url(#glow)" />
                {nodes.map((node1, i) =>
                    nodes.slice(i + 1).map(node2 => {
                        const dx = node1.x - node2.x;
                        const dy = node1.y - node2.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        return distance < NODE_CONNECTION_RADIUS ? (
                            <line
                                key={`line-${node1.id}-${node2.id}`}
                                x1={node1.x} y1={node1.y}
                                x2={node2.x} y2={node2.y}
                                stroke={`rgba(168, 85, 247, ${0.4 * (1 - distance / NODE_CONNECTION_RADIUS)})`}
                                strokeWidth="1"
                            />
                        ) : null;
                    })
                )}
            </svg>
            {nodes.map(node => {
                const dx = node.x - mousePos.current.x; const dy = node.y - mousePos.current.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return (
                    <SkillNode key={node.id} skill={node.skill} x={node.x} y={node.y} size={node.size} isNearby={distance < MOUSE_REPEL_RADIUS} />
                );
            })}
        </div>
    );
};


// --- Main Skills Section Component ---

interface SkillsProps {
    portfolioData: PortfolioData;
}

export const Skills: React.FC<SkillsProps> = ({ portfolioData }) => {
    const allSkills = Object.values(portfolioData.skills).flat();
    
    return (
        <section id="skills" className="container mx-auto px-6 max-w-7xl py-24 lg:py-36">
            <SectionHeader subtitle="Expertise" title="Technical" highlight="Arsenal" />
            <AnimatedSection className="mb-24">
                <SkillConstellation skills={allSkills.slice(0, 16)} />
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

