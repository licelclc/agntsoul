import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export default async function SkillDetailPage({ params }: Props) {
  const supabase = createClient();

  const { data: skill, error } = await supabase
    .from('skills')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !skill) {
    notFound();
  }

  // 增加浏览计数
  await supabase.rpc('increment_view_count', { skill_id: params.id });

  return (
    <div className="min-h-screen grid-bg">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* 返回 */}
          <Link 
            href="/"
            className="inline-flex items-center text-white/60 hover:text-white mb-8 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>

          {/* 技能信息 */}
          <div className="glass-card p-8">
            {/* 头部 */}
            <div className="flex items-start gap-6 mb-8">
              {skill.avatar ? (
                <img 
                  src={skill.avatar} 
                  alt={skill.name}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-accent-primary/20 flex items-center justify-center">
                  <span className="text-4xl">🤖</span>
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{skill.name}</h1>
                <p className="text-white/60">作者：{skill.author}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-sm">
                    {skill.category}
                  </span>
                  {skill.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-white/60 text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 描述 */}
            <p className="text-white/80 text-lg mb-8">{skill.description}</p>

            {/* 统计 */}
            <div className="flex gap-8 mb-8 text-sm text-white/40">
              <span>👁️ {skill.view_count} 次浏览</span>
              <span>⬇️ {skill.download_count} 次下载</span>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <a
                href={`/api/skills/${skill.id}/download`}
                className="px-6 py-3 bg-accent-primary rounded-xl text-white hover:bg-accent-primary/80 transition-colors"
              >
                下载 .skill 文件
              </a>
              {skill.skill_url && (
                <a
                  href={skill.skill_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:bg-white/10 transition-colors"
                >
                  查看源文件
                </a>
              )}
            </div>
          </div>

          {/* 配置预览 */}
          {skill.config && (
            <div className="mt-8 glass-card p-8">
              <h2 className="text-xl font-bold mb-6">配置预览</h2>
              
              {skill.config.personality && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/60 mb-2">PERSONALITY</h3>
                  <p className="text-white/80 whitespace-pre-wrap">{skill.config.personality}</p>
                </div>
              )}

              {skill.config.system_prompt && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/60 mb-2">SYSTEM PROMPT</h3>
                  <pre className="bg-white/5 p-4 rounded-xl text-sm text-white/80 overflow-x-auto whitespace-pre-wrap">
                    {skill.config.system_prompt}
                  </pre>
                </div>
              )}

              {skill.config.tools?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-white/60 mb-2">TOOLS</h3>
                  <div className="flex flex-wrap gap-2">
                    {skill.config.tools.map((tool: string) => (
                      <span key={tool} className="px-3 py-1 rounded-full bg-accent-secondary/10 text-accent-secondary text-sm">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skill.config.examples?.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-white/60 mb-2">EXAMPLES</h3>
                  <div className="space-y-4">
                    {skill.config.examples.map((ex: any, i: number) => (
                      <div key={i} className="bg-white/5 p-4 rounded-xl">
                        <p className="text-white/60 text-sm mb-1">User:</p>
                        <p className="text-white/80 mb-3">{ex.user}</p>
                        <p className="text-white/60 text-sm mb-1">Assistant:</p>
                        <p className="text-white/80">{ex.assistant}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
