// 管理员认证检查工具
export interface AdminAuth {
  isAuthenticated: boolean
  token?: string
  loginAt?: string
}

export function checkAdminAuth(): AdminAuth {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false }
  }

  const token = localStorage.getItem('admin_token')
  const loginAt = localStorage.getItem('admin_login_at')

  if (!token || !loginAt) {
    return { isAuthenticated: false }
  }

  // 检查是否过期（24小时）
  const loginTime = new Date(loginAt).getTime()
  const now = Date.now()
  const expiresIn = 24 * 60 * 60 * 1000 // 24小时

  if (now - loginTime > expiresIn) {
    // 已过期，清除
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_login_at')
    return { isAuthenticated: false }
  }

  return {
    isAuthenticated: true,
    token,
    loginAt
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_login_at')
  }
}
