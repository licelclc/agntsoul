import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const supabase = createClient();

  let query = supabase
    .from('skills')
    .select('id, name, description, avatar, author, category, tags, download_count, created_at', { count: 'exact' })
    .eq('status', 'published')
    .order('download_count', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (category) {
    query = query.eq('category', category);
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total: count,
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description, avatar, author, category, tags, skill_content, skill_url } = body;

  const supabase = createClient();

  // 解析内容
  let config = null;
  let contentHash = null;

  if (skill_content) {
    const { parseSkillMd } = await import('@/lib/parser');
    const { hashContent } = await import('@/lib/utils');
    config = parseSkillMd(skill_content);
    contentHash = hashContent(skill_content);
  }

  const { data, error } = await supabase
    .from('skills')
    .insert({
      name: name || config?.name || '未命名技能',
      description: description || config?.description || '',
      avatar,
      author: author || config?.author || 'Unknown',
      category: category || config?.category || 'General',
      tags: tags || config?.tags || [],
      skill_content,
      skill_url,
      config,
      content_hash: contentHash,
      status: 'published',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}
