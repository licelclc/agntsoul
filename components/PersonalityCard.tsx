import Link from 'next/link'
import { PersonalityRecord } from '@/types/personality'
import { Download, Eye } from 'lucide-react'

interface Props {
  personality: PersonalityRecord
}

export default function PersonalityCard({ personality }: Props) {
  const tags = personality.tags.slice(0, 3)
  
  return (
    <Link href={`/p/${personality.personality_id}`}>
      <div className="card p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {personality.avatar_url ? (
            <img 
              src={personality.avatar_url} 
              alt={personality.name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl">
              🎭
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate">{personality.name}</h3>
            <p className="text-gray-500 text-sm">{personality.role}</p>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
          {personality.description || '这个人还没有介绍'}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag: string) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {personality.view_count}
          </span>
          <span className="flex items-center gap-1">
            <Download size={14} />
            {personality.download_count}
          </span>
        </div>
      </div>
    </Link>
  )
}
