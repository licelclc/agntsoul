import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('personalities')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Fetch personalities error:', error)
      return NextResponse.json(
        { error: '获取数据失败' },
        { status: 500 }
      )
    }

    // 确保每条记录都有 status 字段（兼容旧数据）
    const personalities = (data || []).map(p => ({
      ...p,
      status: p.status || 'approved' // 旧数据默认为已通过
    }))

    return NextResponse.json({ personalities })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
