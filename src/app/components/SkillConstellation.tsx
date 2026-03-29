'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// --- Improved Slug Mapping for Simple Icons ---
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
    'python': 'python'
  };
  const s = skill.toLowerCase().trim().replace(/\s+/g, '');
  return map[s] || s;
};

interface SkillConstellationProps {
  skillsData:Record<string, string[]>;
}

export const SkillConstellation: React.FC<SkillConstellationProps> = ({ skillsData }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- 1. Background Animation Logic ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const particles: { x: number; y: number; size: number; vx: number; vy: number }[] = [];
    const particleCount = 30;

    const resize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.offsetWidth;
        canvas.height = containerRef.current.offsetHeight;
      }
    };

    window.addEventListener('resize', resize);
    resize();

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fill();

        // Draw Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 180) {
            ctx.beginPath();
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 180)})`;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full py-24 px-6 overflow-hidden min-h-screen bg-black">
      {/* Interactive Background Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500"
          >
            Technical Ecosystem
          </motion.h2>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-[0.3em]">
            Expertise across the stack
          </p>
        </div>

        {/* The Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skillsData).map(([category, items], idx) => {
            // CRITICAL FIX: Ensure we only map arrays to avoid crash
            if (!Array.isArray(items)) return null;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative p-8 rounded-[2.5rem] bg-zinc-900/30 border border-white/5 backdrop-blur-2xl hover:bg-zinc-800/40 hover:border-blue-500/20 transition-all duration-500"
              >
                {/* Floating Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-700" />
                
                <h3 className="relative text-lg font-semibold mb-8 text-zinc-400 group-hover:text-white transition-colors flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  {category}
                </h3>

                <div className="relative flex flex-wrap gap-3">
                  {items.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center gap-2.5 px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.08] hover:scale-105 transition-all duration-300 cursor-default group/skill"
                    >
                      <Image
                        src={`https://cdn.simpleicons.org/${getIconSlug(skill)}/white`}
                        className="w-4 h-4 opacity-50 group-hover/skill:opacity-100 transition-opacity"
                        alt={skill}
                        width={16}
                        height={16}
                        unoptimized
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <span className="text-sm font-medium text-zinc-500 group-hover/skill:text-white transition-colors">
                        {skill}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};