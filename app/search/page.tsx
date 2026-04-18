import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SkillCard } from '@/components/SkillCard';
import { SearchBar } from '@/components/SearchBar';

interface Props {
  searchParams: { q?: string; category?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  const supabase = createClient();
  const query = searchParams.q || '';
  const category = searchParams.category || '';

  let skillsQuery = supabase
    .from('skills')
    .select('id, name, description, avatar, author, category, tags, download_count')
    .eq('status', 'published');

  if (query) {
    skillsQuery = skillsQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  }

  if (category) {
    skillsQuery = skillsQuery.eq('category', category);
  }

  const { data: skills } = await skillsQuery.order('download_count', { ascending: false });

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div className="min-h-screen grid-bg">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* 搜索框 */}
          <div className="max-w-2xl mx-auto mb-12">
            <SearchBar />
          </div>

          {/* 分类筛选 */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8 justify-center">
              <a
                href="/search"
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  !category 
                    ? 'bg-accent-primary text-white' 
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                全部
              </a>
              {categories.map(cat => (
                <a
                  key={cat.id}
                  href={`/search?category=${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    category === cat.slug 
                      ? 'bg-accent-primary text-white' 
                      : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {cat.icon} {cat.name}
                </a>
              ))}
            </div>
          )}

          {/* 搜索结果 */}
          {query && (
            <h2 className="text-xl mb-8 text-white/60">
              搜索 "{query}" 的结果：{skills?.length || 0} 个
            </h2>
          )}

          {skills && skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map(skill => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-white/40">
              <p className="text-lg">没有找到相关技能</p>
              <p className="text-sm mt-2">试试其他关键词或分类</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
