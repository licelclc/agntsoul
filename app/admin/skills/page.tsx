'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Skill } from '@/types';
import { LoadUrlModal } from '@/components/LoadUrlModal';
import { useEffect } from 'react';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const { data } = await supabase
      .from('skills')
      .select('*')
      .order('created_at', { ascending: false });
    
    setSkills(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个技能吗？')) return;
    
    await supabase.from('skills').delete().eq('id', id);
    setSkills(skills.filter(s => s.id !== id));
  };

  const handleLoadSuccess = (skill: Skill) => {
    setSkills([skill, ...skills]);
    setShowModal(false);
  };

  if (loading) {
    return <p className="text-white/60">加载中...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">技能管理</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-accent-primary rounded-xl text-white hover:bg-accent-primary/80 transition-colors"
        >
          从 URL 导入
        </button>
      </div>

      {skills.length > 0 ? (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/60 text-sm">名称</th>
                <th className="text-left p-4 text-white/60 text-sm">分类</th>
                <th className="text-left p-4 text-white/60 text-sm">作者</th>
                <th className="text-left p-4 text-white/60 text-sm">下载量</th>
                <th className="text-left p-4 text-white/60 text-sm">状态</th>
                <th className="text-left p-4 text-white/60 text-sm">操作</th>
              </tr>
            </thead>
            <tbody>
              {skills.map(skill => (
                <tr key={skill.id} className="border-b border-white/5 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {skill.avatar ? (
                        <img src={skill.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-accent-primary/20 flex items-center justify-center text-sm">🤖</div>
                      )}
                      <span>{skill.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-white/60">{skill.category}</td>
                  <td className="p-4 text-white/60">{skill.author}</td>
                  <td className="p-4 text-white/60">{skill.download_count}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      skill.status === 'published' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {skill.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <a
                        href={`/skill/${skill.id}`}
                        target="_blank"
                        className="px-3 py-1 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 text-sm"
                      >
                        查看
                      </a>
                      <button
                        onClick={() => handleDelete(skill.id)}
                        className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 text-white/40">
          <p>暂无技能数据</p>
          <p className="text-sm mt-2">点击上方按钮从 URL 导入</p>
        </div>
      )}

      <LoadUrlModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleLoadSuccess}
      />
    </div>
  );
}
