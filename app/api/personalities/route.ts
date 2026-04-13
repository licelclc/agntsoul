import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Personality } from '@/types/personality'

export async function POST(request: NextRequest) {
  try {
    const data: Personality = await request.json()

    // 验证必填字段
    if (!data.personality_id || !data.identity?.name || !data.personality_core) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      )
    }

    // 检查是否已存在
    const { data: existing } = await supabaseAdmin
      .from('personalities')
      .select('id')
      .eq('personality_id', data.personality_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: '该人格ID已存在' },
        { status: 400 }
      )
    }

    // 插入数据库
    const { error } = await supabaseAdmin
      .from('personalities')
      .insert({
        personality_id: data.personality_id,
        name: data.identity.name,
        display_name: data.identity.display_name,
        role: data.identity.role,
        avatar_url: data.identity.avatar,
        description: data.metadata.description,
        personality_data: data,
        type: data.metadata.type || 'public',
        source: data.metadata.source || 'constructed',
        tags: data.metadata.tags || [],
        version: data.metadata.version || '1.0.0',
        license: data.metadata.license || 'CC-BY-SA',
      })

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json(
        { error: '保存失败' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      personality_id: data.personality_id 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
