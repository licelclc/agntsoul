'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Shield, Lock, AlertCircle, ArrowLeft } from 'lucide-react'
import ParticleBackground from '@/components/ParticleBackground'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 验证密码
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || '验证失败')
      }

      // 保存登录状态到 localStorage
      localStorage.setItem('admin_token', result.token)
      localStorage.setItem('admin_login_at', new Date().toISOString())
      
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative bg-[#0a0a1a]">
      {/* 粒子背景 */}
      <ParticleBackground />
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span>返回首页</span>
        </Link>
      </header>

      {/* Login Card */}
      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md">
          <div className="card bg-white/5 border-white/10 backdrop-blur-xl p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-4">
                <Shield size={32} className="text-cyan-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">管理后台</h1>
              <p className="text-white/60 text-sm">AgntSoul 管理员入口</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-400 font-medium">登录失败</p>
                  <p className="text-red-400/70 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  管理密码
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入管理密码"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-lg hover:from-cyan-400 hover:to-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '验证中...' : '登录'}
              </button>
            </form>

            {/* Tips */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/40 text-xs text-center">
                请使用管理员密码登录，如忘记密码请联系开发者
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
