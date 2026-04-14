'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Shield, LayoutDashboard, Users, BarChart3, Settings, 
  LogOut, Menu, X, FileText, TrendingUp 
} from 'lucide-react'
import { checkAdminAuth, logout } from '@/lib/adminAuth'

const navItems = [
  { href: '/admin/dashboard', label: '数据看板', icon: LayoutDashboard },
  { href: '/admin/personalities', label: '人格管理', icon: Users },
  { href: '/admin/logs', label: '操作日志', icon: FileText },
  { href: '/admin/settings', label: '系统设置', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const auth = checkAdminAuth()
    if (!auth.isAuthenticated) {
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#0a0a1a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <span className="font-bold text-white">AgntSoul Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-white/60 hover:text-white"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-[#0a0a1a]/95 backdrop-blur-xl border-r border-white/10 z-50
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <span className="font-black text-lg text-white">AgntSoul</span>
              <span className="block text-xs text-cyan-400">管理后台</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
              <TrendingUp size={14} />
              <span>系统状态</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm">运行正常</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={18} />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 pt-20 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  )
}
