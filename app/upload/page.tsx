'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, FileJson, AlertCircle, File, CheckCircle2, Sparkles } from 'lucide-react'
import { Personality } from '@/types/personality'
import { detectAndParse } from '@/lib/personalityConverter'
import ThemeToggle from '@/components/ThemeToggle'
import ParticleBackground from '@/components/ParticleBackground'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<'json' | 'skill' | null>(null)
  const [data, setData] = useState<Personality | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setError(null)
    setFile(selectedFile)

    try {
      const text = await selectedFile.text()
      
      // 自动检测文件类型并解析
      const result = detectAndParse(text)
      setFileType(result.type)
      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析文件失败')
      setData(null)
      setFileType(null)
    }
  }

  const handleUpload = async () => {
    if (!data) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/personalities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || '上传失败')
      }

      router.push(`/p/${data.personality_id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* 粒子背景（暗色模式） */}
      <ParticleBackground />
      
      {/* Header */}
      <header className="bg-white/70 dark:bg-transparent backdrop-blur-xl border-b border-gray-100 dark:border-white/10 sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="AgntSoul" 
              className="h-10 w-auto rounded-lg"
            />
            <div className="flex flex-col">
              <span className="font-black text-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 dark:from-cyan-400 dark:via-pink-500 dark:to-purple-500 bg-clip-text text-transparent">
                AgntSoul
              </span>
              <span className="text-xs text-gray-400 dark:text-white/50">AI人格市场</span>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
              <ArrowLeft size={24} className="text-gray-600 dark:text-white" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">上传人格</h1>
          </div>

          {/* Supported Formats */}
          <div className="card p-4 mb-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles size={20} className="text-cyan-400" />
              <span className="font-medium text-gray-900 dark:text-white">支持多种格式导入</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/50 dark:bg-white/10 rounded-lg text-sm">
                <FileJson size={16} className="text-cyan-500" />
                <span className="text-gray-700 dark:text-white/80">AgntSoul JSON</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/50 dark:bg-white/10 rounded-lg text-sm">
                <File size={16} className="text-purple-500" />
                <span className="text-gray-700 dark:text-white/80">SKILL.md</span>
              </span>
            </div>
          </div>

          {/* Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="card p-12 text-center cursor-pointer hover:border-primary-300 border-2 border-dashed border-gray-200 dark:border-white/20 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.md,.skill"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  fileType === 'skill' 
                    ? 'bg-purple-500/20' 
                    : 'bg-cyan-500/20'
                }`}>
                  {fileType === 'skill' ? (
                    <File size={32} className="text-purple-400" />
                  ) : (
                    <FileJson size={32} className="text-cyan-400" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{file.name}</p>
                  <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
                    {fileType === 'skill' ? 'SKILL.md 格式 (将自动转换)' : 'JSON 格式'}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setData(null)
                    setFileType(null)
                  }}
                  className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  重新选择
                </button>
              </div>
            ) : (
              <>
                <Upload size={48} className="mx-auto text-gray-400 dark:text-white/30 mb-4" />
                <p className="text-gray-600 dark:text-white/60 mb-2">点击上传人格文件</p>
                <p className="text-gray-400 dark:text-white/40 text-sm">
                  支持 .json、.md、.skill 格式
                </p>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg flex items-start gap-2">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-700 dark:text-red-400">上传失败</p>
                <p className="text-sm text-red-600 dark:text-red-400/70">{error}</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {data && (
            <div className="mt-8 card p-6">
              {/* Type Badge */}
              {fileType === 'skill' && (
                <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-purple-400" />
                  <span className="text-purple-400 text-sm">
                    已自动识别并转换 SKILL.md 格式
                  </span>
                </div>
              )}

              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">预览</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-lg">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-xl font-bold text-cyan-400">
                    {data.identity.display_name?.[0] || data.identity.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {data.identity.display_name || data.identity.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-white/50">
                      {data.personality_id}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500 dark:text-white/50 text-sm">角色</span>
                    <p className="text-gray-900 dark:text-white">{data.identity.role || '未设置'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-white/50 text-sm">类型</span>
                    <p className="text-gray-900 dark:text-white capitalize">{data.metadata.type}</p>
                  </div>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-white/50 text-sm">标签</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.metadata.tags.map((tag: string) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                    {data.metadata.tags.length === 0 && (
                      <span className="text-gray-400 dark:text-white/30 text-sm">无标签</span>
                    )}
                  </div>
                </div>

                {data.metadata.description && (
                  <div>
                    <span className="text-gray-500 dark:text-white/50 text-sm">简介</span>
                    <p className="mt-1 text-gray-700 dark:text-white/80">{data.metadata.description}</p>
                  </div>
                )}

                <div>
                  <span className="text-gray-500 dark:text-white/50 text-sm">核心性格</span>
                  <p className="mt-1 text-gray-700 dark:text-white/80">
                    {data.personality_core.traits.join('、') || '未设置'}
                  </p>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-white/50 text-sm">擅长领域</span>
                  <p className="mt-1 text-gray-700 dark:text-white/80">
                    {data.capabilities.skills.join('、') || '未设置'}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleUpload}
                disabled={loading}
                className="btn-primary w-full mt-6"
              >
                {loading ? '上传中...' : '确认上传'}
              </button>
            </div>
          )}

          {/* Format Guide */}
          <div className="mt-8 card p-6">
            <h3 className="font-bold mb-4 text-gray-900 dark:text-white">人格格式说明</h3>
            <p className="text-gray-600 dark:text-white/60 text-sm mb-4">
              上传的人格文件需要符合人格标准格式，支持以下两种格式：
            </p>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileJson size={18} className="text-cyan-500" />
                  <span className="font-medium text-gray-900 dark:text-white">AgntSoul JSON</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-white/50">
                  标准的人格JSON格式，包含完整的字段定义
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <File size={18} className="text-purple-500" />
                  <span className="font-medium text-gray-900 dark:text-white">SKILL.md (OpenClaw格式)</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-white/50">
                  包含 frontmatter 的 Markdown 格式，系统会自动解析并转换为标准JSON
                </p>
                <div className="mt-3 p-3 bg-white dark:bg-black/20 rounded text-xs font-mono text-gray-600 dark:text-white/60">
                  {`---
name: 人格名称
description: 描述
tags: [标签1, 标签2]
---
# 正文内容...`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
