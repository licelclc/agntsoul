import { parseSkillMd } from '@/lib/parser';
import { hashContent } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // 验证 URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  // 获取远程内容
  let content: string;
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'AgntSoul/1.0' },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch');
    }

    content = await response.text();
  } catch (error: any) {
    return NextResponse.json({ 
      error: `无法获取URL内容: ${error.message}` 
    }, { status: 400 });
  }

  // 解析内容
  const config = parseSkillMd(content);
  if (!config) {
    return NextResponse.json({ error: '无效的 SKILL.md 格式' }, { status: 400 });
  }

  const contentHash = hashContent(content);

  const supabase = createClient();

  // 检查是否已存在
  const { data: existing } = await supabase
    .from('skills')
    .select('id')
    .eq('content_hash', contentHash)
    .single();

  if (existing) {
    return NextResponse.json({ 
      data: existing, 
      isNew: false,
      message: '技能已存在' 
    });
  }

  // 创建新技能
  const { data, error } = await supabase
    .from('skills')
    .insert({
      name: config.name || '未命名技能',
      description: config.description || '',
      author: config.author || 'Unknown',
      category: config.category || 'General',
      tags: config.tags || [],
      skill_url: url,
      skill_content: content,
      config,
      content_hash: contentHash,
      status: 'published',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, isNew: true });
}
