'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || '登录失败');
      }
    } catch {
      setError('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary grid-bg">
      <div className="glass-card p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center gradient-text">
          后台登录
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-white/60 mb-2 block">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@agntsoul.com"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                       text-white placeholder-white/40 focus:border-accent-primary 
                       focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-white/60 mb-2 block">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                       text-white placeholder-white/40 focus:border-accent-primary 
                       focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full px-4 py-3 bg-accent-primary rounded-xl text-white
                     hover:bg-accent-primary/80 disabled:opacity-50 transition-colors"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="text-center text-white/40 text-xs mt-6">
          <a href="/" className="hover:text-white transition-colors">返回首页</a>
        </p>
      </div>
    </div>
  );
}
