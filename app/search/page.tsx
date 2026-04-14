'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PersonalityRecord } from '@/types/personality'
import PersonalityCard from '@/components/PersonalityCard'
import { ArrowLeft, Search } from 'lucide-react'

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
      const { data, error } = await supabase
        .from('personalities')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20)

      if (!error && data) {
        setResults(data)
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                AgntSoul
              </span>
              <span className="text-xs text-gray-400">AI人格市场</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-8">
        <div className="container">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
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
                className="w-full px-4 py-3 pl-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <main className="container py-8">
        <h2 className="text-2xl font-bold mb-6">
          {query ? `搜索结果: "${query}"` : '请输入关键词搜索'}
        </h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">搜索中...</div>
          </div>
        ) : results.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-gray-500 mb-4">
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
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container text-center text-gray-500">
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
        <div className="text-gray-400">加载中...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
