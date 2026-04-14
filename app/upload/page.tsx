'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, FileJson, AlertCircle } from 'lucide-react'
import { Personality } from '@/types/personality'
import ThemeToggle from '@/components/ThemeToggle'
import ParticleBackground from '@/components/ParticleBackground'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
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
      const json = JSON.parse(text)
      
      // 验证格式
      if (!json.schema_version || !json.personality_id || !json.identity || !json.personality_core) {
        throw new Error('人格格式不正确，请检查JSON文件')
      }
      
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : '解析文件失败')
      setData(null)
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
          <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white">
            <ArrowLeft size={20} />
            返回
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">上传人格</h1>

          {/* Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="card p-12 text-center cursor-pointer hover:border-primary-300 border-2 border-dashed border-gray-200"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileJson size={32} className="text-primary-600" />
                <span className="text-lg">{file.name}</span>
              </div>
            ) : (
              <>
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">点击上传人格JSON文件</p>
                <p className="text-gray-400 text-sm">支持 .json 格式</p>
              </>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-2">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">上传失败</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Preview */}
          {data && (
            <div className="mt-8 card p-6">
              <h2 className="text-xl font-bold mb-4">预览</h2>
              <div className="space-y-4">
                <div>
                  <span className="text-gray-500">名称：</span>
                  <span className="font-medium">{data.identity.name}</span>
                </div>
                <div>
                  <span className="text-gray-500">角色：</span>
                  <span>{data.identity.role}</span>
                </div>
                <div>
                  <span className="text-gray-500">类型：</span>
                  <span>{data.metadata.type}</span>
                </div>
                <div>
                  <span className="text-gray-500">标签：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {data.metadata.tags.map((tag: string) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
                {data.metadata.description && (
                  <div>
                    <span className="text-gray-500">简介：</span>
                    <p className="mt-1 text-gray-700">{data.metadata.description}</p>
                  </div>
                )}
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
            <h3 className="font-bold mb-4">人格格式说明</h3>
            <p className="text-gray-600 text-sm mb-4">
              上传的人格文件需要符合人格标准格式 v1.0，包含以下字段：
            </p>
            <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
              <li>schema_version - 格式版本</li>
              <li>personality_id - 唯一标识</li>
              <li>identity - 身份信息</li>
              <li>personality_core - 性格内核</li>
              <li>values_principles - 价值观原则</li>
              <li>capabilities - 能力配置</li>
              <li>metadata - 元数据</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
