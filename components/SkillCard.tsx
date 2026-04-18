'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatNumber } from '@/lib/utils';

interface SkillCardProps {
  skill: {
    id: string;
    name: string;
    description: string;
    avatar?: string;
    author: string;
    category: string;
    tags: string[];
    download_count: number;
  };
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="glass-card p-6 cursor-pointer group"
    >
      <Link href={`/skill/${skill.id}`}>
        {/* 头部 */}
        <div className="flex items-start gap-4 mb-4">
          {skill.avatar ? (
            <img 
              src={skill.avatar} 
              alt={skill.name}
              className="w-12 h-12 rounded-xl object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate group-hover:text-accent-primary transition-colors">
              {skill.name}
            </h3>
            <p className="text-sm text-white/60">{skill.author}</p>
          </div>
        </div>

        {/* 描述 */}
        <p className="text-sm text-white/70 mb-4 line-clamp-2">
          {skill.description}
        </p>

        {/* 标签 */}
        {skill.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {skill.tags.slice(0, 3).map(tag => (
              <span 
                key={tag} 
                className="text-xs px-2 py-1 rounded-full bg-accent-secondary/10 text-accent-secondary"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 底部 */}
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-1 rounded-full bg-accent-primary/10 text-accent-primary">
            {skill.category}
          </span>
          <span className="text-xs text-white/40">
            {formatNumber(skill.download_count)} 次下载
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
