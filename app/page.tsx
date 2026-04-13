import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { PersonalityRecord } from '@/types/personality'
import PersonalityCard from '@/components/PersonalityCard'
import SearchBar from '@/components/SearchBar'
import UploadButton from '@/components/UploadButton'

async function getPersonalities(): Promise<PersonalityRecord[]> {
  const { data, error } = await supabase
    .from('personalities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)
  
  if (error) {
    console.error('Error fetching personalities:', error)
    return []
  }
  
  return data || []
}

export default async function Home() {
  const personalities = await getPersonalities()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🚢</span>
            <span className="font-bold text-xl">FerryMind</span>
          </Link>
          <UploadButton />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">
            发现、分享、保存你的AI人格
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            让人格可保存、可迁移、可资产化
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-12">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-primary-600">{personalities.length}</div>
            <div className="text-gray-500">人格数量</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-primary-600">
              {personalities.reduce((sum, p) => sum + p.download_count, 0)}
            </div>
            <div className="text-gray-500">总下载量</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-primary-600">
              {personalities.reduce((sum, p) => sum + p.view_count, 0)}
            </div>
            <div className="text-gray-500">总访问量</div>
          </div>
        </div>

        {/* Personality List */}
        <h2 className="text-2xl font-bold mb-6">最新人格</h2>
        
        {personalities.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🎭</div>
            <p className="text-gray-500 mb-4">还没有人格，快来上传第一个吧！</p>
            <UploadButton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personalities.map((personality) => (
              <PersonalityCard key={personality.id} personality={personality} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container text-center text-gray-500">
          <p>人格市场 MVP · AI Personality Market</p>
          <p className="text-sm mt-2">人格标准格式 v1.0</p>
        </div>
      </footer>
    </div>
  )
}
