import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500)

    if (error) {
      console.error('Fetch logs error:', error)
      return NextResponse.json(
        { error: '获取日志失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({ logs: data || [] })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
