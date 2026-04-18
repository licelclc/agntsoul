'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skill } from '@/types';

interface LoadUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (skill: Skill) => void;
}

export function LoadUrlModal({ isOpen, onClose, onSuccess }: LoadUrlModalProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = async () => {
    if (!url) return;
    
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/skills/load-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '加载失败');
      }

      onSuccess(data.data);
      onClose();
      setUrl('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card p-8 w-full max-w-lg mx-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 gradient-text">
              从 URL 加载技能
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 mb-2 block">
                  .skill 文件地址
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://raw.githubusercontent.com/.../SKILL.md"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl 
                           text-white placeholder-white/30 focus:border-accent-primary 
                           focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                           text-white/60 hover:bg-white/10 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleLoad}
                  disabled={loading || !url}
                  className="flex-1 px-4 py-3 bg-accent-primary rounded-xl text-white
                           hover:bg-accent-primary/80 disabled:opacity-50 transition-colors"
                >
                  {loading ? '加载中...' : '加载'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
