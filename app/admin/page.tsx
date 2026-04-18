import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminPage() {
  const supabase = createClient();

  // 获取统计数据
  const { count: skillCount } = await supabase
    .from('skills')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  const { data: recentSkills } = await supabase
    .from('skills')
    .select('id, name, download_count, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">概览</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm mb-2">技能总数</p>
          <p className="text-4xl font-bold gradient-text">{skillCount || 0}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm mb-2">分类数量</p>
          <p className="text-4xl font-bold gradient-text">6</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm mb-2">今日新增</p>
          <p className="text-4xl font-bold gradient-text">0</p>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold mb-4">快捷操作</h2>
        <div className="flex gap-4">
          <Link
            href="/admin/skills"
            className="px-6 py-3 bg-accent-primary rounded-xl text-white hover:bg-accent-primary/80 transition-colors"
          >
            管理技能
          </Link>
          <Link
            href="/admin/categories"
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:bg-white/10 transition-colors"
          >
            管理分类
          </Link>
        </div>
      </div>

      {/* 最近添加 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">最近添加</h2>
        {recentSkills && recentSkills.length > 0 ? (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-white/60 text-sm">名称</th>
                  <th className="text-left p-4 text-white/60 text-sm">下载量</th>
                  <th className="text-left p-4 text-white/60 text-sm">添加时间</th>
                </tr>
              </thead>
              <tbody>
                {recentSkills.map(skill => (
                  <tr key={skill.id} className="border-b border-white/5 last:border-0">
                    <td className="p-4">{skill.name}</td>
                    <td className="p-4 text-white/60">{skill.download_count}</td>
                    <td className="p-4 text-white/40 text-sm">
                      {new Date(skill.created_at).toLocaleDateString('zh-CN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-white/40">暂无数据</p>
        )}
      </div>
    </div>
  );
}
