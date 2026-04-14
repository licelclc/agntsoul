'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PersonalityRecord } from '@/types/personality'
import PersonalityCard from '@/components/PersonalityCard'
import { ArrowLeft, Search } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import ParticleBackground from '@/components/ParticleBackground'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<PersonalityRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(query)

  useEffect(() => {
    async function search() {
      if (!query) {
        setResults([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (data.results) {
          setResults(data.results)
        }
      } catch (error) {
        console.error('Search error:', error)
      }
      setLoading(false)
    }

    search()
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* 粒子背景（暗色模式） */}
      <ParticleBackground />
      
      {/* Header */}
      <header className="bg-white/70 dark:bg-transparent backdrop-blur-xl border-b border-gray-100 dark:border-white/10 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="AgntSoul" 
              className="h-10 w-auto rounded-lg"
            />
            <div className="flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 dark:from-cyan-400 dark:via-pink-500 dark:to-purple-500 bg-clip-text text-transparent">
                AgntSoul
              </span>
              <span className="text-xs text-gray-400 dark:text-white/50">AI人格市场</span>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-gradient-to-b from-primary-50/80 to-white/50 dark:from-transparent dark:to-transparent py-8 relative">
        <div className="container">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-white/60 hover:text-gray-700 dark:hover:text-white mb-4">
            <ArrowLeft size={18} />
            返回首页
          </Link>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索人格..."
                className="w-full px-4 py-3 pl-12 rounded-full border border-gray-200 dark:border-white/20 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-cyan-400"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/50" size={20} />
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <main className="container py-8 relative">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {query ? `搜索结果: "${query}"` : '请输入关键词搜索'}
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-white/50">搜索中...</div>
          </div>
        ) : results.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-gray-400 dark:text-white/40 text-6xl mb-4">🔍</div>
            <p className="text-gray-500 dark:text-white/60 mb-4">
              {query ? '没有找到相关人格' : '请输入关键词进行搜索'}
            </p>
            {query && <Link href="/" className="btn-secondary">返回首页</Link>}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((personality) => (
              <PersonalityCard key={personality.id} personality={personality} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/70 dark:bg-transparent backdrop-blur-xl border-t border-gray-100 dark:border-white/10 py-8 relative">
        <div className="container text-center text-gray-500 dark:text-white/50">
          <p>人格市场 MVP · AI Personality Market</p>
        </div>
      </footer>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 dark:text-white/50">加载中...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
