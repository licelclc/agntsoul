import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// 简单的令牌生成
function generateToken(password: string): string {
  const secret = process.env.ADMIN_PASSWORD || 'default_admin_secret'
  return crypto
    .createHash('sha256')
    .update(password + secret + Date.now())
    .digest('hex')
    .slice(0, 32)
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: '请提供密码' },
        { status: 400 }
      )
    }

    // 验证密码
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminPassword) {
      return NextResponse.json(
        { error: '管理员未配置' },
        { status: 500 }
      )
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      )
    }

    // 生成令牌
    const token = generateToken(password)

    return NextResponse.json({
      success: true,
      token,
      expires_in: 86400 // 24小时
    })
  } catch (error) {
    console.error('Admin verify error:', error)
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    )
  }
}
