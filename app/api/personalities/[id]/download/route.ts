import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 增加下载计数
    const { error } = await supabaseAdmin.rpc('increment_download_count', {
      p_id: params.id
    })

    // 如果RPC不存在，直接更新
    if (error) {
      const { data } = await supabaseAdmin
        .from('personalities')
        .select('download_count')
        .eq('personality_id', params.id)
        .single()

      if (data) {
        await supabaseAdmin
          .from('personalities')
          .update({ download_count: data.download_count + 1 })
          .eq('personality_id', params.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
