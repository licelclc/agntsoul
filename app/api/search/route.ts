import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q) {
    return NextResponse.json({ results: [] })
  }

  const { data, error } = await supabaseAdmin
    .from('personalities')
    .select('*')
    .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
    .or(`tags.cs.{${q}}`)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: '搜索失败' }, { status: 500 })
  }

  return NextResponse.json({ results: data })
}
