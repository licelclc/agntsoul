import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status } = await request.json()

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: '无效的状态值' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('personalities')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)

    if (error) {
      console.error('Update status error:', error)
      return NextResponse.json(
        { error: '更新失败' },
        { status: 500 }
      )
    }

    // 记录操作日志
    await supabaseAdmin
      .from('admin_logs')
      .insert({
        action: 'update_status',
        target_type: 'personality',
        target_id: id,
        new_value: status,
        created_at: new Date().toISOString()
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 先获取记录信息（用于日志）
    const { data: record } = await supabaseAdmin
      .from('personalities')
      .select('personality_id, name')
      .eq('id', id)
      .single()

    const { error } = await supabaseAdmin
      .from('personalities')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json(
        { error: '删除失败' },
        { status: 500 }
      )
    }

    // 记录操作日志
    if (record) {
      await supabaseAdmin
        .from('admin_logs')
        .insert({
          action: 'delete',
          target_type: 'personality',
          target_id: id,
          description: `删除人格: ${record.name || record.personality_id}`,
          created_at: new Date().toISOString()
        })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
