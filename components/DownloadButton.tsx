'use client'

import { PersonalityRecord } from '@/types/personality'
import { Download } from 'lucide-react'

interface Props {
  personality: PersonalityRecord
}

export default function DownloadButton({ personality }: Props) {
  const handleDownload = () => {
    const data = personality.personality_data
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${personality.name}_人格.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    // 增加下载计数
    fetch(`/api/personalities/${personality.personality_id}/download`, {
      method: 'POST'
    })
  }

  return (
    <button
      onClick={handleDownload}
      className="btn-primary w-full flex items-center justify-center gap-2"
    >
      <Download size={18} />
      下载人格
    </button>
  )
}
