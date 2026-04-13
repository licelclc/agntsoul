'use client'

import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'

export default function UploadButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/upload')}
      className="btn-primary flex items-center gap-2"
    >
      <Upload size={18} />
      上传人格
    </button>
  )
}
