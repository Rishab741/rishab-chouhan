'use client';

import React, { useRef, useEffect } from 'react';

// --- Icon Slug Helper ---
const getIconSlug = (skill: string) => {
    const s = skill.toLowerCase();
    
    if (s === 'c++') return 'cplusplus';
    if (s === 'c#') return 'csharp';
    if (s === '.net') return 'dotnet';
    if (s.includes('react')) return 'react';
    if (s.includes('next')) return 'nextdotjs';
    if (s.includes('node')) return 'nodedotjs';
    if (s.includes('aws')) return 'amazonaws';
    if (s.includes('mongo')) return 'mongodb';
    if (s.includes('google') || s.includes('gcp')) return 'googlecloud';
    if (s.includes('tailwind')) return 'tailwindcss';
    if (s.includes('postgres')) return 'postgresql';
    if (s.includes('express')) return 'express';
    if (s.includes('flutter')) return 'flutter';
    if (s.includes('dart')) return 'dart';
    if (s.includes('docker')) return 'docker';
    if (s.includes('kubernetes')) return 'kubernetes';
    
    return s.replace(/\./g, 'dot').replace(/\s+/g, '');
};

// --- Glow Colors ---
const getSkillColor = (skill: string) => {
    const s = skill.toLowerCase();
    if (['react', 'typescript', 'docker', 'kubernetes', 'go', 'python'].some(t => s.includes(t))) return 'bg-blue-500 shadow-blue-500/50';
    if (['javascript', 'aws', 'linux', 'git'].some(t => s.includes(t))) return 'bg-yellow-500 shadow-yellow-500/50';
    if (['node', 'mongo', 'vue', 'spring'].some(t => s.includes(t))) return 'bg-green-500 shadow-green-500/50';
    if (['html', 'css', 'java', 'rust', 'swift'].some(t => s.includes(t))) return 'bg-orange-500 shadow-orange-500/50';
    if (['graphql', 'c#', 'c++', 'redux'].some(t => s.includes(t))) return 'bg-purple-500 shadow-purple-500/50';
    return 'bg-white shadow-white/50';
};

// --- Types ---
type NodeData = {
    id: number;
    skill: string;
    slug: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    phase: number; // For breathing animation
};

interface SkillConstellationProps {
    skills: string[];
}

export const SkillConstellation: React.FC<SkillConstellationProps> = ({ skills }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // DOM Refs
    const nodeElementsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const textElementsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});
    
    // State Refs
    const nodesRef = useRef<NodeData[]>([]);
    const mousePos = useRef({ x: -9999, y: -9999 });
    const dimensions = useRef({ w: 0, h: 0 });

    // --- Tuning Constants ---
    const MAX_NODES = 40;
    const SPEED = 0.15; // Slow, ambient drift
    const CONNECTION_RADIUS = 150;
    const SPOTLIGHT_RADIUS = 250; // How far the mouse effects nodes

    // 1. Init & Resize
    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const handleResize = () => {
            if (containerRef.current && canvasRef.current) {
                const { clientWidth, clientHeight } = containerRef.current;
                dimensions.current = { w: clientWidth, h: clientHeight };
                
                const dpr = window.devicePixelRatio || 1;
                canvasRef.current.width = clientWidth * dpr;
                canvasRef.current.height = clientHeight * dpr;
                canvasRef.current.style.width = `${clientWidth}px`;
                canvasRef.current.style.height = `${clientHeight}px`;
                
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) ctx.scale(dpr, dpr);

                if (nodesRef.current.length === 0) {
                    initNodes(clientWidth, clientHeight);
                }
            }
        };

        const initNodes = (w: number, h: number) => {
            const activeSkills = skills.slice(0, MAX_NODES);
            nodesRef.current = activeSkills.map((skill, i) => ({
                id: i,
                skill,
                slug: getIconSlug(skill),
                x: Math.random() * w,
                y: Math.random() * h,
                // Constant consistent motion
                vx: (Math.random() - 0.5) * SPEED, 
                vy: (Math.random() - 0.5) * SPEED,
                phase: Math.random() * Math.PI * 2 // Random starting phase for pulsing
            }));
        };

        handleResize();
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, [skills]);

    // 2. Animation Loop
    useEffect(() => {
        let animationFrameId: number;
        let time = 0;
        
        const render = () => {
            if (!canvasRef.current) return;
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            const { w, h } = dimensions.current;
            const { x: mouseX, y: mouseY } = mousePos.current;
            
            time += 0.01; // Global time for pulsing

            ctx.clearRect(0, 0, w, h);

            nodesRef.current.forEach((node, i) => {
                // --- 1. Constant Motion ---
                node.x += node.vx;
                node.y += node.vy;

                // Soft Wall Bounce
                if (node.x <= 0 || node.x >= w) node.vx *= -1;
                if (node.y <= 0 || node.y >= h) node.vy *= -1;

                // --- 2. Spotlight Logic ---
                const dx = node.x - mouseX;
                const dy = node.y - mouseY;
                const distToMouse = Math.sqrt(dx * dx + dy * dy);
                
                // If in spotlight, full opacity. If far, dim.
                const isHovered = distToMouse < SPOTLIGHT_RADIUS;
                
                // --- 3. DOM Updates ---
                const domNode = nodeElementsRef.current[i];
                const textNode = textElementsRef.current[i];
                const imgNode = domNode?.querySelector('img');

                if (domNode) {
                    // Breathing effect: slight scale variation
                    const breathe = Math.sin(time + node.phase) * 0.1; 
                    const baseScale = isHovered ? 1.4 : 0.8; 
                    const finalScale = baseScale + breathe;

                    const opacity = isHovered ? 1 : 0.35; // Dimmer when idle
                    const zIndex = isHovered ? 50 : 10;
                    const grayscale = isHovered ? '0%' : '100%';

                    domNode.style.transform = `translate3d(${node.x}px, ${node.y}px, 0) translate(-50%, -50%) scale(${finalScale})`;
                    domNode.style.zIndex = `${zIndex}`;
                    domNode.style.opacity = `${opacity}`;
                    
                    if (imgNode) imgNode.style.filter = `grayscale(${grayscale})`;

                    // Text Label visibility
                    if (isHovered && distToMouse < 100) {
                        domNode.classList.add('active-node');
                        if (textNode) {
                            textNode.style.opacity = '1';
                            textNode.style.transform = 'translateY(0)';
                        }
                    } else {
                        domNode.classList.remove('active-node');
                        if (textNode) {
                            textNode.style.opacity = '0';
                            textNode.style.transform = 'translateY(-8px)';
                        }
                    }
                }

                // --- 4. Draw Lines ---
                for (let j = i + 1; j < nodesRef.current.length; j++) {
                    const node2 = nodesRef.current[j];
                    const dx2 = node.x - node2.x;
                    const dy2 = node.y - node2.y;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                    if (dist2 < CONNECTION_RADIUS) {
                        // Calculate opacity
                        // Base opacity is low (0.05). 
                        // If EITHER node is hovered, boost line opacity (0.2).
                        const dxM2 = node2.x - mouseX;
                        const dyM2 = node2.y - mouseY;
                        const distToMouse2 = Math.sqrt(dxM2 * dxM2 + dyM2 * dyM2);
                        
                        const isLineActive = isHovered || distToMouse2 < SPOTLIGHT_RADIUS;
                        const maxOpacity = isLineActive ? 0.3 : 0.08;
                        
                        const opacity = (1 - dist2 / CONNECTION_RADIUS) * maxOpacity;

                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(node2.x, node2.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    // 3. Mouse Handlers
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mousePos.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseLeave = () => {
        mousePos.current = { x: -9999, y: -9999 };
    };

    return (
        <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full h-[600px] bg-black/40 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-sm group"
        >
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

            {/* DOM Nodes */}
            {skills.slice(0, MAX_NODES).map((skill, i) => {
                const glowColor = getSkillColor(skill);
                const slug = getIconSlug(skill); 
                
                return (
                    <div
                        key={i}
                        ref={(el) => { nodeElementsRef.current[i] = el; }}
                        className="absolute will-change-transform flex items-center justify-center transition-opacity duration-300"
                        style={{ width: '40px', height: '40px', transform: 'translate3d(-100px, -100px, 0)' }}
                    >
                        {/* Glow (Visible on Hover) */}
                        <div className={`
                            absolute inset-0 rounded-full blur-md opacity-0 transition-opacity duration-300
                            group-[.active-node]:opacity-100 ${glowColor}
                        `} />
                        
                        {/* Logo Container */}
                        <div className="relative z-10 w-full h-full p-1.5 bg-black/50 rounded-full border border-white/10 backdrop-blur-sm">
                            <img 
                                src={`https://cdn.simpleicons.org/${slug}/white`} 
                                alt={skill}
                                className="w-full h-full object-contain transition-all duration-300"
                                style={{ filter: 'grayscale(100%)' }} 
                                onError={(e) => {
                                    const parent = e.currentTarget.parentElement;
                                    if (parent) {
                                        e.currentTarget.style.display = 'none';
                                        parent.innerText = skill.charAt(0);
                                        parent.classList.add("flex", "items-center", "justify-center", "font-bold", "text-white/50");
                                    }
                                }}
                            />
                        </div>

                        {/* Tooltip Label */}
                        <div 
                            ref={(el) => { textElementsRef.current[i] = el; }}
                            className="absolute top-full mt-3 px-2 py-1 bg-black/90 border border-white/10 rounded text-[10px] font-mono uppercase text-white pointer-events-none opacity-0 transition-all duration-300 whitespace-nowrap z-50 shadow-xl"
                        >
                            {skill}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};