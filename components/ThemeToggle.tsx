'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(saved === 'dark' || (!saved && prefersDark))
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
      localStorage.setItem('theme', isDark ? 'dark' : 'light')
      // 同时设置/移除 dark class，让 Tailwind dark: 前缀生效
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [isDark, mounted])

  // 防止水合不匹配
  if (!mounted) {
    return (
      <div className="p-2 rounded-full">
        <div className="w-5 h-5" />
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
      aria-label="切换主题"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600 transition-transform hover:-rotate-12" />
      )}
    </button>
  )
}
