'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { PersonalityRecord } from '@/types/personality'
import DownloadModal from './DownloadModal'

interface Props {
  personality: PersonalityRecord
  className?: string
}

export default function DownloadPersonalityButton({ personality, className = '' }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`btn-primary w-full flex items-center justify-center gap-2 ${className}`}
      >
        <Download size={18} />
        下载人格
      </button>

      <DownloadModal
        personality={personality}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
