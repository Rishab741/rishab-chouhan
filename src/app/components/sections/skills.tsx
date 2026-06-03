'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PortfolioData } from '../types';

const getIconSlug = (skill: string) => {
  const map: Record<string, string> = {
    'reactjs': 'react', 'nextjs': 'nextdotjs', 'nodejs': 'nodedotjs',
    'postgresql': 'postgresql', 'springboot': 'springboot', 'gcp': 'googlecloud',
    'solidity': 'solidity', 'scikit-learn': 'scikitlearn', 'c++': 'cplusplus',
    'c#': 'csharp', 'mongodb': 'mongodb', 'aws': 'amazonaws', 'docker': 'docker',
    'linux': 'linux', 'typescript': 'typescript', 'java': 'java', 'python': 'python',
    'javascript': 'javascript', 'tailwindcss': 'tailwindcss', 'kubernetes': 'kubernetes',
    'graphql': 'graphql', 'redis': 'redis', 'git': 'git',
  };
  return map[skill.toLowerCase().trim().replace(/\s+/g, '')] || skill.toLowerCase().trim().replace(/\s+/g, '');
};

const ACCENTS = [
  { dot: 'bg-blue-400', hover: 'hover:border-blue-500/30', glow: 'from-blue-500/8 to-blue-500/0' },
  { dot: 'bg-violet-400', hover: 'hover:border-violet-500/30', glow: 'from-violet-500/8 to-violet-500/0' },
  { dot: 'bg-emerald-400', hover: 'hover:border-emerald-500/30', glow: 'from-emerald-500/8 to-emerald-500/0' },
  { dot: 'bg-pink-400', hover: 'hover:border-pink-500/30', glow: 'from-pink-500/8 to-pink-500/0' },
  { dot: 'bg-amber-400', hover: 'hover:border-amber-500/30', glow: 'from-amber-500/8 to-amber-500/0' },
  { dot: 'bg-cyan-400', hover: 'hover:border-cyan-500/30', glow: 'from-cyan-500/8 to-cyan-500/0' },
];

interface SkillsProps {
  portfolioData: PortfolioData;
}

export const Skills: React.FC<SkillsProps> = ({ portfolioData }) => {
  const categories = Object.entries(portfolioData.skills).filter(([, s]) => Array.isArray(s));
  const totalSkills = categories.reduce((acc, [, s]) => acc + s.length, 0);
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="skills" className="relative py-20 bg-black overflow-hidden">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59,130,246,0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59,130,246,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />
      {/* Soft radial fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(59,130,246,0.06),transparent)]" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <span className="inline-block px-3 py-1 text-[10px] font-mono tracking-[0.28em] uppercase border border-blue-500/25 rounded-full text-blue-400 bg-blue-500/5 mb-4">
            Technical Arsenal
          </span>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500">
              Skills &amp;{' '}
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400">
              Expertise
            </span>
          </h2>
          <p className="text-zinc-600 text-xs font-mono tracking-widest">
            {totalSkills} technologies · {categories.length} domains
          </p>
        </motion.div>

        {/* ── Filter tabs ── */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <button
            onClick={() => setActive(null)}
            className={`px-3.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 ${
              active === null
                ? 'bg-white text-black shadow-md'
                : 'bg-white/[0.04] text-zinc-500 border border-white/8 hover:bg-white/8 hover:text-zinc-300'
            }`}
          >
            All
          </button>
          {categories.map(([cat]) => (
            <button
              key={cat}
              onClick={() => setActive(active === cat ? null : cat)}
              className={`px-3.5 py-1 rounded-full text-[11px] font-semibold transition-all duration-200 ${
                active === cat
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/[0.04] text-zinc-500 border border-white/8 hover:bg-white/8 hover:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* ── Category cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map(([category, skills], idx) => {
            const accent = ACCENTS[idx % ACCENTS.length];
            const dimmed = active !== null && active !== category;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: idx * 0.06, ease: 'easeOut' }}
                className={`group relative rounded-2xl border border-white/[0.07] bg-zinc-900/35 backdrop-blur-xl p-4 transition-all duration-300 ${accent.hover} ${dimmed ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
              >
                {/* Hover glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accent.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                {/* Category header */}
                <div className="relative flex items-center gap-2 mb-3">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${accent.dot}`} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    {category}
                  </span>
                  <span className="ml-auto text-[10px] font-mono text-zinc-700">{skills.length}</span>
                </div>

                {/* Divider */}
                <div className="relative h-px bg-white/[0.05] mb-3" />

                {/* Skill pills */}
                <div className="relative flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <SkillPill key={skill} skill={skill} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

const SkillPill: React.FC<{ skill: string }> = ({ skill }) => (
  <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.12] transition-all duration-150 cursor-default group/pill">
    <Image
      src={`https://cdn.simpleicons.org/${getIconSlug(skill)}/ffffff`}
      className="w-3 h-3 opacity-35 group-hover/pill:opacity-75 transition-opacity flex-shrink-0"
      alt={skill}
      width={12}
      height={12}
      unoptimized
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
    />
    <span className="text-[11px] font-medium text-zinc-500 group-hover/pill:text-zinc-200 transition-colors whitespace-nowrap leading-none">
      {skill}
    </span>
  </div>
);
