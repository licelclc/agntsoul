'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Search, Filter, MoreVertical, Eye, Edit, Trash2, 
  CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight,
  Download, RefreshCw, CheckSquare, Square, AlertTriangle
} from 'lucide-react'

interface PersonalityRecord {
  id: string
  personality_id: string
  name: string
  display_name: string | null
  role: string | null
  avatar_url: string | null
  description: string | null
  type: string
  source: string
  tags: string[]
  version: string
  view_count: number
  download_count: number
  created_at: string
  updated_at: string
  status: 'pending' | 'approved' | 'rejected'
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected'

export default function PersonalitiesPage() {
  const [personalities, setPersonalities] = useState<PersonalityRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [actionLoading, setActionLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const itemsPerPage = 10
  const router = useRouter()

  useEffect(() => {
    fetchPersonalities()
  }, [])

  const fetchPersonalities = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/personalities')
      if (res.ok) {
        const data = await res.json()
        setPersonalities(data.personalities || [])
      }
    } catch (error) {
      console.error('Failed to fetch personalities:', error)
    } finally {
      setLoading(false)
    }
  }

  // 过滤数据
  const filteredData = personalities.filter(p => {
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.personality_id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // 分页
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // 批量选择
  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedData.map(p => p.id)))
    }
  }

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

  // 审核操作
  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/personalities/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (res.ok) {
        setPersonalities(prev => 
          prev.map(p => p.id === id ? { ...p, status } : p)
        )
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setActionLoading(false)
    }
  }

  // 删除操作
  const deletePersonality = async (id: string) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/admin/personalities/${id}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        setPersonalities(prev => prev.filter(p => p.id !== id))
        setShowDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    } finally {
      setActionLoading(false)
    }
  }

  // 批量审核
  const batchApprove = async () => {
    if (selectedIds.size === 0) return
    setActionLoading(true)
    try {
      await Promise.all(
        Array.from(selectedIds).map(id => 
          fetch(`/api/admin/personalities/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'approved' })
          })
        )
      )
      setPersonalities(prev => 
        prev.map(p => selectedIds.has(p.id) ? { ...p, status: 'approved' as const } : p)
      )
      setSelectedIds(new Set())
    } catch (error) {
      console.error('Batch approve failed:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
            <Clock size={12} />
            待审核
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
            <CheckCircle size={12} />
            已通过
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
            <XCircle size={12} />
            已拒绝
          </span>
        )
      default:
        return null
    }
  }

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      public: 'bg-blue-500/20 text-blue-400',
      private: 'bg-gray-500/20 text-gray-400',
      paid: 'bg-purple-500/20 text-purple-400'
    }
    return (
      <span className={`px-2 py-1 ${colors[type] || colors.public} text-xs rounded-full`}>
        {type === 'public' ? '公开' : type === 'private' ? '私有' : '付费'}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">人格管理</h1>
          <p className="text-white/60 text-sm mt-1">
            共 {personalities.length} 个人格
          </p>
        </div>
        <button
          onClick={fetchPersonalities}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/80 rounded-lg hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>刷新</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card bg-white/5 border-white/10 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索人格名称、ID..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-white/40" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilter)
                setCurrentPage(1)
              }}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option value="all">全部状态</option>
              <option value="pending">待审核</option>
              <option value="approved">已通过</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
        </div>

        {/* Batch Actions */}
        {selectedIds.size > 0 && (
          <div className="mt-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg flex items-center justify-between">
            <span className="text-cyan-400 text-sm">
              已选择 {selectedIds.size} 项
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={batchApprove}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
              >
                批量通过
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="px-3 py-1.5 bg-white/10 text-white/60 rounded-lg hover:bg-white/20 transition-colors text-sm"
              >
                取消选择
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="card bg-white/5 border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw size={32} className="animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-white/60">加载中...</p>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-white/40">暂无数据</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-4 text-left">
                    <button
                      onClick={toggleSelectAll}
                      className="text-white/40 hover:text-white"
                    >
                      {selectedIds.size === paginatedData.length && paginatedData.length > 0 ? (
                        <CheckSquare size={18} className="text-cyan-400" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-4 text-left text-white/60 text-sm font-medium">人格</th>
                  <th className="px-4 py-4 text-left text-white/60 text-sm font-medium">类型</th>
                  <th className="px-4 py-4 text-left text-white/60 text-sm font-medium">状态</th>
                  <th className="px-4 py-4 text-left text-white/60 text-sm font-medium">下载</th>
                  <th className="px-4 py-4 text-left text-white/60 text-sm font-medium">访问</th>
                  <th className="px-4 py-4 text-left text-white/60 text-sm font-medium">创建时间</th>
                  <th className="px-4 py-4 text-right text-white/60 text-sm font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((personality) => (
                  <tr 
                    key={personality.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleSelect(personality.id)}
                        className="text-white/40 hover:text-white"
                      >
                        {selectedIds.has(personality.id) ? (
                          <CheckSquare size={18} className="text-cyan-400" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-cyan-400 font-bold">
                          {personality.display_name?.[0] || personality.name[0]}
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {personality.display_name || personality.name}
                          </div>
                          <div className="text-white/40 text-xs">
                            {personality.personality_id.slice(0, 16)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getTypeBadge(personality.type)}
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(personality.status)}
                    </td>
                    <td className="px-4 py-4 text-white/80">
                      {personality.download_count.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-white/80">
                      {personality.view_count.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-white/60 text-sm">
                      {new Date(personality.created_at).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/p/${personality.personality_id}`}
                          className="p-2 text-white/40 hover:text-cyan-400 transition-colors"
                          title="预览"
                        >
                          <Eye size={18} />
                        </Link>
                        {personality.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(personality.id, 'approved')}
                              disabled={actionLoading}
                              className="p-2 text-white/40 hover:text-green-400 transition-colors"
                              title="通过"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => updateStatus(personality.id, 'rejected')}
                              disabled={actionLoading}
                              className="p-2 text-white/40 hover:text-red-400 transition-colors"
                              title="拒绝"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setShowDeleteConfirm(personality.id)}
                          className="p-2 text-white/40 hover:text-red-400 transition-colors"
                          title="删除"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-white/60 text-sm">
              第 {currentPage} / {totalPages} 页，共 {filteredData.length} 条
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number
                if (totalPages <= 5) {
                  page = i + 1
                } else if (currentPage <= 3) {
                  page = i + 1
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i
                } else {
                  page = currentPage - 2 + i
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/5 text-white/60 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card bg-[#1a1a2e] border-white/20 p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">确认删除</h3>
                <p className="text-white/60 text-sm">此操作不可撤销</p>
              </div>
            </div>
            <p className="text-white/80 mb-6">
              确定要删除这个人格吗？删除后，所有相关数据将被永久清除。
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => deletePersonality(showDeleteConfirm)}
                disabled={actionLoading}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {actionLoading ? '删除中...' : '确认删除'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
