import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { 
  Users, Download, Eye, TrendingUp, ArrowUpRight,
  Sparkles, Clock, Zap, Crown
} from 'lucide-react'

async function getDashboardStats() {
  // 获取总人格数
  const { count: totalCount } = await supabaseAdmin
    .from('personalities')
    .select('*', { count: 'exact', head: true })

  // 获取本周新增
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const { count: weekCount } = await supabaseAdmin
    .from('personalities')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', weekAgo.toISOString())

  // 获取总下载量
  const { data: downloadData } = await supabaseAdmin
    .from('personalities')
    .select('download_count')
  
  const totalDownloads = downloadData?.reduce((sum, p) => sum + (p.download_count || 0), 0) || 0

  // 获取总访问量
  const { data: viewData } = await supabaseAdmin
    .from('personalities')
    .select('view_count')
  
  const totalViews = viewData?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0

  // 获取热门人格 TOP 10
  const { data: topPersonalities } = await supabaseAdmin
    .from('personalities')
    .select('personality_id, name, display_name, download_count, view_count')
    .order('download_count', { ascending: false })
    .limit(10)

  // 获取最近7天的下载趋势
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const { data: recentStats } = await supabaseAdmin
    .from('personalities')
    .select('created_at, download_count, view_count')

  // 计算每日数据
  const dailyData: Record<string, { downloads: number, views: number }> = {}
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    dailyData[dateStr] = { downloads: 0, views: 0 }
  }

  // 填充数据（简化处理）
  recentStats?.forEach(p => {
    const dateStr = p.created_at.split('T')[0]
    if (dailyData[dateStr]) {
      dailyData[dateStr].downloads += p.download_count || 0
      dailyData[dateStr].views += p.view_count || 0
    }
  })

  return {
    totalCount: totalCount || 0,
    weekCount: weekCount || 0,
    totalDownloads,
    totalViews,
    topPersonalities: topPersonalities || [],
    dailyData: Object.entries(dailyData).map(([date, data]) => ({
      date,
      ...data
    }))
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  const maxDownload = Math.max(...stats.dailyData.map(d => d.downloads), 1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">数据看板</h1>
          <p className="text-white/60 text-sm mt-1">实时监控平台数据</p>
        </div>
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>数据已更新</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <Users size={24} className="text-cyan-400" />
            </div>
            <ArrowUpRight size={20} className="text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalCount}</div>
          <div className="text-white/60 text-sm">人格总量</div>
          <div className="mt-2 text-cyan-400 text-xs">
            <Zap size={12} className="inline mr-1" />
            本周 +{stats.weekCount}
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Download size={24} className="text-purple-400" />
            </div>
            <ArrowUpRight size={20} className="text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalDownloads.toLocaleString()}</div>
          <div className="text-white/60 text-sm">总下载量</div>
          <div className="mt-2 text-purple-400 text-xs">
            <TrendingUp size={12} className="inline mr-1" />
            平台累计
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Eye size={24} className="text-orange-400" />
            </div>
            <ArrowUpRight size={20} className="text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{stats.totalViews.toLocaleString()}</div>
          <div className="text-white/60 text-sm">总访问量</div>
          <div className="mt-2 text-orange-400 text-xs">
            <Eye size={12} className="inline mr-1" />
            用户浏览
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Sparkles size={24} className="text-green-400" />
            </div>
            <ArrowUpRight size={20} className="text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.totalCount > 0 ? Math.round(stats.totalDownloads / stats.totalCount) : 0}
          </div>
          <div className="text-white/60 text-sm">平均下载/人格</div>
          <div className="mt-2 text-green-400 text-xs">
            <Clock size={12} className="inline mr-1" />
            热门趋势
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Download Trend */}
        <div className="lg:col-span-2 card bg-white/5 border-white/10 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-cyan-400" />
            下载趋势（近7天）
          </h3>
          <div className="h-48 flex items-end gap-2">
            {stats.dailyData.map((day, index) => {
              const height = Math.max((day.downloads / maxDownload) * 100, 4)
              const dayLabel = new Date(day.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col items-center justify-end" style={{ height: '160px' }}>
                    <div 
                      className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400/50 rounded-t-sm transition-all hover:from-cyan-400 hover:to-cyan-300"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-white/40 text-xs">{dayLabel}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card bg-white/5 border-white/10 p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Crown size={20} className="text-yellow-400" />
            今日概况
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Users size={16} className="text-cyan-400" />
                </div>
                <span className="text-white/80">新增人格</span>
              </div>
              <span className="text-white font-bold">{stats.weekCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Download size={16} className="text-purple-400" />
                </div>
                <span className="text-white/80">今日下载</span>
              </div>
              <span className="text-white font-bold">
                {stats.dailyData[stats.dailyData.length - 1]?.downloads || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Eye size={16} className="text-orange-400" />
                </div>
                <span className="text-white/80">今日浏览</span>
              </div>
              <span className="text-white font-bold">
                {stats.dailyData[stats.dailyData.length - 1]?.views || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Personalities */}
      <div className="card bg-white/5 border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Crown size={20} className="text-yellow-400" />
            热门人格 TOP 10
          </h3>
          <Link 
            href="/admin/personalities" 
            className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
          >
            查看全部 →
          </Link>
        </div>
        
        {stats.topPersonalities.length === 0 ? (
          <div className="text-center py-12 text-white/40">
            <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
            <p>暂无人格数据</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.topPersonalities.map((personality, index) => (
              <Link
                key={personality.personality_id}
                href={`/p/${personality.personality_id}`}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
                  ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                    index === 1 ? 'bg-gray-400/20 text-gray-300' : 
                    index === 2 ? 'bg-orange-500/20 text-orange-400' : 
                    'bg-white/10 text-white/60'}
                `}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">
                    {personality.display_name || personality.name}
                  </div>
                  <div className="text-white/40 text-xs truncate">
                    {personality.personality_id}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-purple-400 flex items-center gap-1">
                    <Download size={14} />
                    <span>{personality.download_count}</span>
                  </div>
                  <div className="text-orange-400 flex items-center gap-1">
                    <Eye size={14} />
                    <span>{personality.view_count}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
