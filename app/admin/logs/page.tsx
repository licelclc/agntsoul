'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, Clock, RefreshCw, Filter, Search,
  CheckCircle, XCircle, Edit, Trash2, Plus, Settings
} from 'lucide-react'

interface LogEntry {
  id: string
  action: string
  target_type: string
  target_id: string
  description: string | null
  old_value: string | null
  new_value: string | null
  created_at: string
}

const actionLabels: Record<string, { label: string; icon: any; color: string }> = {
  'create': { label: '创建', icon: Plus, color: 'text-green-400' },
  'update': { label: '更新', icon: Edit, color: 'text-blue-400' },
  'delete': { label: '删除', icon: Trash2, color: 'text-red-400' },
  'update_status': { label: '状态变更', icon: Settings, color: 'text-purple-400' },
  'login': { label: '登录', icon: CheckCircle, color: 'text-cyan-400' },
  'logout': { label: '登出', icon: XCircle, color: 'text-gray-400' },
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/logs')
      if (res.ok) {
        const data = await res.json()
        setLogs(data.logs || [])
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  // 过滤
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target_id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    
    return matchesSearch && matchesAction
  })

  // 分页
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getActionBadge = (action: string) => {
    const config = actionLabels[action] || { label: action, icon: FileText, color: 'text-gray-400' }
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 ${config.color} bg-current/10 text-xs rounded-full`}>
        <Icon size={12} />
        {config.label}
      </span>
    )
  }

  const formatTime = (time: string) => {
    const date = new Date(time)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">操作日志</h1>
          <p className="text-white/60 text-sm mt-1">
            共 {logs.length} 条记录
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>刷新</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card bg-white/5 border-white/10 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索操作描述..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-white/40" />
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">全部操作</option>
              <option value="create">创建</option>
              <option value="update">更新</option>
              <option value="delete">删除</option>
              <option value="update_status">状态变更</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="card bg-white/5 border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw size={32} className="animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-white/60">加载中...</p>
          </div>
        ) : paginatedLogs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={48} className="text-white/20 mx-auto mb-4" />
            <p className="text-white/40">暂无日志记录</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {paginatedLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-1">
                    {getActionBadge(log.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white font-medium">
                        {log.description || `${actionLabels[log.action]?.label || log.action} 操作`}
                      </span>
                      {log.new_value && (
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">
                          {log.new_value === 'approved' ? '已通过' : log.new_value === 'rejected' ? '已拒绝' : log.new_value}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/40">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {formatTime(log.created_at)}
                      </span>
                      <span>ID: {log.target_id.slice(0, 16)}...</span>
                      <span>类型: {log.target_type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-white/60 text-sm">
              第 {currentPage} / {totalPages} 页，共 {filteredLogs.length} 条
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                上一页
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
