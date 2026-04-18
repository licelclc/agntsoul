import { createClient } from '@/lib/supabase/server';
import { generateSkillMd } from '@/lib/parser';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  const { data: skill, error } = await supabase
    .from('skills')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !skill) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // 增加下载计数
  await supabase.rpc('increment_download_count', { skill_id: params.id });

  // 生成 SKILL.md 内容
  const content = generateSkillMd(skill);

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(skill.name)}.skill.md`,
    },
  });
}
