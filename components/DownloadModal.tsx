'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Download, FileJson, MessageSquare, Sparkles, FileText } from 'lucide-react'
import { PersonalityRecord } from '@/types/personality'
import { personalityToPrompt, getFileName, PromptFormat, FORMAT_INFO } from '@/lib/personalityConverter'

interface DownloadModalProps {
  personality: PersonalityRecord
  isOpen: boolean
  onClose: () => void
}

type DownloadFormat = 'json' | PromptFormat

const formatOptions: { key: DownloadFormat; icon: typeof FileJson }[] = [
  { key: 'json', icon: FileJson },
  { key: 'chatgpt', icon: MessageSquare },
  { key: 'claude', icon: Sparkles },
  { key: 'generic', icon: FileText },
]

export default function DownloadModal({ personality, isOpen, onClose }: DownloadModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>('json')
  const [isDownloading, setIsDownloading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // ESC 关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // 点击遮罩关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // 下载处理
  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      const data = personality.personality_data
      let content: string
      let filename: string

      if (selectedFormat === 'json') {
        content = JSON.stringify(data, null, 2)
        filename = `${personality.name}_人格.json`
      } else {
        content = personalityToPrompt(data, selectedFormat)
        filename = getFileName(data, selectedFormat)
      }

      // 创建下载
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // 增加下载计数
      await fetch(`/api/personalities/${personality.personality_id}/download`, {
        method: 'POST'
      })

      onClose()
    } catch (error) {
      console.error('下载失败:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="card w-full max-w-md animate-slide-up overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">下载人格</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-gray-500 dark:text-white/60 mb-4">选择导出格式：</p>
          
          <div className="space-y-3">
            {formatOptions.map(({ key, icon: Icon }) => {
              const info = FORMAT_INFO[key]
              const isSelected = selectedFormat === key
              
              return (
                <button
                  key={key}
                  onClick={() => setSelectedFormat(key)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected 
                      ? 'border-cyan-400 dark:border-cyan-400 bg-cyan-500/10 dark:bg-cyan-500/10' 
                      : 'border-gray-100 dark:border-white/10 hover:border-gray-200 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      isSelected ? 'bg-cyan-500/20' : 'bg-gray-100 dark:bg-white/10'
                    }`}>
                      <Icon size={20} className={
                        isSelected ? 'text-cyan-400' : 'text-gray-500 dark:text-white/60'
                      } />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white">{info.name}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 text-xs bg-cyan-500 text-white dark:text-black rounded-full">
                            已选择
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-white/60 mt-0.5">{info.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            取消
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 btn-primary flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <>
                <span className="animate-spin">⏳</span>
                下载中...
              </>
            ) : (
              <>
                <Download size={18} />
                下载
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
