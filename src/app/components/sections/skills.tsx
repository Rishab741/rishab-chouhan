'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
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
  { line: 'from-blue-500/0 via-blue-500/60 to-blue-500', label: 'text-blue-400', dot: 'bg-blue-500' },
  { line: 'from-violet-500/0 via-violet-500/60 to-violet-500', label: 'text-violet-400', dot: 'bg-violet-500' },
  { line: 'from-emerald-500/0 via-emerald-500/60 to-emerald-500', label: 'text-emerald-400', dot: 'bg-emerald-500' },
  { line: 'from-pink-500/0 via-pink-500/60 to-pink-500', label: 'text-pink-400', dot: 'bg-pink-500' },
  { line: 'from-amber-500/0 via-amber-500/60 to-amber-500', label: 'text-amber-400', dot: 'bg-amber-500' },
  { line: 'from-cyan-500/0 via-cyan-500/60 to-cyan-500', label: 'text-cyan-400', dot: 'bg-cyan-500' },
];

interface SkillsProps {
  portfolioData: PortfolioData;
}

export const Skills: React.FC<SkillsProps> = ({ portfolioData }) => {
  const categories = Object.entries(portfolioData.skills).filter(([, s]) => Array.isArray(s));
  const totalSkills = categories.reduce((acc, [, s]) => acc + s.length, 0);

  return (
    <section id="skills" className="relative py-16 bg-black overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99,102,241,0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99,102,241,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(99,102,241,0.05),transparent)]" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          className="text-center mb-14"
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
            {totalSkills} technologies across {categories.length} domains
          </p>
        </motion.div>

        {/* ── Scroll-reveal categories ── */}
        <div className="space-y-12">
          {categories.map(([category, skills], idx) => (
            <SkillCategorySection
              key={category}
              category={category}
              skills={skills as string[]}
              index={idx}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

interface CategoryProps {
  category: string;
  skills: string[];
  index: number;
}

const SkillCategorySection: React.FC<CategoryProps> = ({ category, skills, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <div ref={ref} className="w-full">
      {/* ── Category header ── */}
      <div className="flex items-center gap-3 mb-5 overflow-hidden">
        {/* Left line */}
        <motion.div
          className={`h-px bg-gradient-to-r ${accent.line} flex-shrink-0`}
          style={{ transformOrigin: 'right' }}
          initial={{ scaleX: 0, width: '3rem' }}
          animate={isInView ? { scaleX: 1, width: '3rem' } : { scaleX: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Label */}
        <motion.div
          className="flex items-center gap-2 flex-shrink-0"
          initial={{ opacity: 0, x: -16 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
          transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${accent.dot} shadow-sm`} />
          <h3 className={`text-sm font-bold uppercase tracking-[0.2em] ${accent.label}`}>
            {category}
          </h3>
          <span className="text-[10px] font-mono text-zinc-700 ml-1">
            {skills.length}
          </span>
        </motion.div>

        {/* Right line */}
        <motion.div
          className="flex-1 h-px bg-gradient-to-r from-white/8 to-transparent"
          style={{ transformOrigin: 'left' }}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* ── Skill cards ── */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2.5">
        {skills.map((skill, i) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.92 }}
            transition={{
              duration: 0.32,
              delay: 0.28 + i * 0.035,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <SkillCard skill={skill} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SkillCard: React.FC<{ skill: string }> = ({ skill }) => (
  <div className="group relative p-3 bg-zinc-900/50 border border-white/[0.06] rounded-xl backdrop-blur-sm hover:bg-zinc-800/60 hover:border-white/[0.12] transition-all duration-250 cursor-default overflow-hidden">
    {/* Hover shimmer */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

    <div className="relative flex flex-col items-center gap-1.5">
      {/* Icon */}
      <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.05] group-hover:bg-white/[0.1] transition-colors duration-250">
        <Image
          src={`https://cdn.simpleicons.org/${getIconSlug(skill)}/ffffff`}
          className="w-4 h-4 opacity-50 group-hover:opacity-90 transition-opacity duration-250"
          alt={skill}
          width={16}
          height={16}
          unoptimized
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      {/* Label */}
      <span className="text-[10px] font-medium text-zinc-500 group-hover:text-zinc-200 transition-colors duration-200 text-center leading-tight line-clamp-1 w-full text-center">
        {skill}
      </span>
    </div>
  </div>
);
