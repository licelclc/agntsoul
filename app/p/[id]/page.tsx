import { supabaseAdmin } from '@/lib/supabase'
import { Personality } from '@/types/personality'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Eye } from 'lucide-react'
import DownloadPersonalityButton from '@/components/DownloadPersonalityButton'
import ThemeToggle from '@/components/ThemeToggle'
import ParticleBackground from '@/components/ParticleBackground'

interface Props {
  params: { id: string }
}

async function getPersonality(personalityId: string) {
  const { data, error } = await supabaseAdmin
    .from('personalities')
    .select('*')
    .eq('personality_id', personalityId)
    .single()
  
  if (error || !data) {
    return null
  }
  
  // 增加浏览量
  await supabaseAdmin
    .from('personalities')
    .update({ view_count: data.view_count + 1 })
    .eq('id', data.id)
  
  return data
}

export default async function PersonalityDetail({ params }: Props) {
  const personality = await getPersonality(params.id)
  
  if (!personality) {
    notFound()
  }

  const data = personality.personality_data as Personality

  return (
    <div className="min-h-screen relative">
      {/* 粒子背景（暗色模式） */}
      <ParticleBackground />
      
      {/* Header */}
      <header className="bg-white/70 dark:bg-transparent backdrop-blur-xl border-b border-gray-100 dark:border-white/10 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft size={20} />
            返回
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <DownloadPersonalityButton personality={personality} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="card p-8">
              <div className="flex items-start gap-6 mb-6">
                {personality.avatar_url ? (
                  <img 
                    src={personality.avatar_url} 
                    alt={personality.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-4xl">
                    🎭
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold mb-2">{personality.name}</h1>
                  <p className="text-gray-500 text-lg">{personality.role}</p>
                  <div className="flex items-center gap-4 mt-3 text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye size={16} />
                      {personality.view_count} 次浏览
                    </span>
                    <span className="flex items-center gap-1">
                      <Download size={16} />
                      {personality.download_count} 次下载
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-gray-600 text-lg">
                {personality.description || '这个人还没有介绍'}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {personality.tags.map((tag: string) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Personality Core */}
            <div className="card p-8">
              <h2 className="text-xl font-bold mb-4">性格特征</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">核心特质</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.personality_core.traits.map((trait: string) => (
                      <span key={trait} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">说话风格</h3>
                  <p className="text-gray-600">{data.personality_core.speaking_style.tone}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    句子长度：{data.personality_core.speaking_style.sentence_length}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">典型开场白</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.personality_core.speaking_style.typical_openers.map((opener: string) => (
                      <span key={opener} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                        "{opener}"
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="card p-8">
              <h2 className="text-xl font-bold mb-4">价值观与原则</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">坚持</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {data.values_principles.beliefs.map((belief: string, i: number) => (
                      <li key={i}>{belief}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">拒绝</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {data.values_principles.refusals.map((refusal: string, i: number) => (
                      <li key={i}>{refusal}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card p-6">
              <DownloadPersonalityButton personality={personality} />
            </div>

            {/* Capabilities */}
            <div className="card p-6">
              <h3 className="font-bold mb-4">能力</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 mb-1">工具</p>
                  <div className="flex flex-wrap gap-1">
                    {data.capabilities.tools.map((tool: string) => (
                      <span key={tool} className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">技能</p>
                  <div className="flex flex-wrap gap-1">
                    {data.capabilities.skills.map((skill: string) => (
                      <span key={skill} className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="card p-6">
              <h3 className="font-bold mb-4">信息</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">类型</dt>
                  <dd>{personality.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">来源</dt>
                  <dd>{personality.source}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">版本</dt>
                  <dd>{personality.version}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">协议</dt>
                  <dd>{personality.license}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">创建时间</dt>
                  <dd>{new Date(personality.created_at).toLocaleDateString('zh-CN')}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
