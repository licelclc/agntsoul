import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* 侧边栏 */}
      <aside className="w-64 bg-bg-surface border-r border-white/10 p-6">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl">⚙️</span>
          <h2 className="font-semibold text-lg">后台管理</h2>
        </div>
        
        <nav className="space-y-1">
          <a href="/admin" className="block px-4 py-2 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            📊 概览
          </a>
          <a href="/admin/skills" className="block px-4 py-2 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            🤖 技能管理
          </a>
          <a href="/admin/categories" className="block px-4 py-2 rounded-lg text-white/60 hover:bg-white/5 hover:text-white transition-colors">
            📁 分类管理
          </a>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <a href="/" className="block px-4 py-2 rounded-lg text-white/40 hover:text-white text-sm transition-colors">
            ← 返回前台
          </a>
        </div>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
