import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SearchBar } from '@/components/SearchBar';
import { SkillCard } from '@/components/SkillCard';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = createClient();
  
  const { data: skills } = await supabase
    .from('skills')
    .select('id, name, description, avatar, author, category, tags, download_count')
    .eq('status', 'published')
    .order('download_count', { ascending: false })
    .limit(12);

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div className="min-h-screen grid-bg">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero */}
          <section className="text-center py-20">
            <h1 className="text-6xl md:text-8xl font-bold mb-4">
              <span className="gradient-text">Agnt</span>
              <span className="text-white/80">Soul</span>
            </h1>
            <p className="text-xl text-white/60 mb-8">
              AI 人格市场 · 发现、分享、下载
            </p>
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </section>

          {/* 分类 */}
          {categories && categories.length > 0 && (
            <section className="mb-12">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map(cat => (
                  <span
                    key={cat.id}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    {cat.icon} {cat.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* 技能列表 */}
          <section>
            <h2 className="text-2xl font-bold mb-8">热门技能</h2>
            {skills && skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.map(skill => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-white/40">
                <p className="text-lg">暂无技能数据</p>
                <p className="text-sm mt-2">请先在后台添加技能或通过 URL 导入</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
