'use client'

import { useState } from 'react'
import { 
  Settings, Shield, Database, Bell, Save,
  RefreshCw, CheckCircle, AlertTriangle, ExternalLink
} from 'lucide-react'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // 模拟保存
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">系统设置</h1>
          <p className="text-white/60 text-sm mt-1">配置管理后台和平台参数</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            saved 
              ? 'bg-green-500 text-white' 
              : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90'
          }`}
        >
          {saving ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              <span>保存中...</span>
            </>
          ) : saved ? (
            <>
              <CheckCircle size={18} />
              <span>已保存</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>保存设置</span>
            </>
          )}
        </button>
      </div>

      {/* Settings Cards */}
      <div className="grid gap-6">
        {/* Security Settings */}
        <div className="card bg-white/5 border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Shield size={24} className="text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">安全设置</h3>
              <p className="text-white/60 text-sm">管理后台访问控制</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-2">管理员密码</label>
              <div className="flex items-center gap-3">
                <input
                  type="password"
                  defaultValue="••••••••"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30"
                  disabled
                />
                <button className="px-4 py-3 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 transition-colors">
                  修改密码
                </button>
              </div>
              <p className="text-white/40 text-xs mt-2">
                密码通过环境变量 ADMIN_PASSWORD 设置
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <div className="text-white font-medium">会话超时</div>
                <div className="text-white/60 text-sm">登录状态保持时间</div>
              </div>
              <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                <option value="3600">1 小时</option>
                <option value="86400" selected>24 小时</option>
                <option value="604800">7 天</option>
              </select>
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="card bg-white/5 border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Database size={24} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">数据库设置</h3>
              <p className="text-white/60 text-sm">人格数据管理配置</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <div className="text-white font-medium">审核模式</div>
                <div className="text-white/60 text-sm">新上传人格的默认状态</div>
              </div>
              <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                <option value="approved">直接通过</option>
                <option value="pending" selected>需要审核</option>
              </select>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <div className="text-white font-medium">人格数量上限</div>
                <div className="text-white/60 text-sm">单个用户可创建的人格数量</div>
              </div>
              <input
                type="number"
                defaultValue={100}
                className="w-24 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-right"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <div className="text-white font-medium">数据保留期</div>
                <div className="text-white/60 text-sm">删除后数据保留天数</div>
              </div>
              <select className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white">
                <option value="7">7 天</option>
                <option value="30" selected>30 天</option>
                <option value="90">90 天</option>
                <option value="365">永久保留</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card bg-white/5 border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Bell size={24} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">通知设置</h3>
              <p className="text-white/60 text-sm">系统事件通知配置</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <div className="text-white font-medium">新人格审核通知</div>
                <div className="text-white/60 text-sm">有人上传新人格时发送通知</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <div className="text-white font-medium">数据异常告警</div>
                <div className="text-white/60 text-sm">数据库异常时发送告警</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-yellow-400 font-medium">配置说明</div>
                  <p className="text-yellow-400/70 text-sm mt-1">
                    通知功能需要配置邮件服务才能正常使用。请在环境变量中设置邮件相关配置。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="card bg-white/5 border-white/10 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Settings size={24} className="text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">系统信息</h3>
              <p className="text-white/60 text-sm">当前运行环境信息</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm mb-1">版本</div>
              <div className="text-white font-medium">v2.0.0</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm mb-1">构建时间</div>
              <div className="text-white font-medium">{new Date().toLocaleDateString('zh-CN')}</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm mb-1">Node.js</div>
              <div className="text-white font-medium">v18.x</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="text-white/60 text-sm mb-1">Next.js</div>
              <div className="text-white font-medium">v14.x</div>
            </div>
          </div>

          <div className="mt-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-4 bg-white/5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ExternalLink size={18} />
              <span>查看 GitHub 仓库</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
