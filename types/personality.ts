// 人格数据类型定义

export interface Personality {
  schema_version: string
  personality_id: string
  
  identity: {
    name: string
    display_name?: string
    role?: string
    avatar?: string
    visual_style?: string
    age_tone?: string
    gender_expression?: string
  }
  
  personality_core: {
    traits: string[]
    speaking_style: {
      tone: string
      sentence_length: string
      emoji_usage: string
      typical_openers: string[]
      habits: string[]
    }
    emotional_expression: {
      when_happy: string
      when_frustrated: string
      when_confused: string
    }
  }
  
  values_principles: {
    beliefs: string[]
    boundaries: string[]
    refusals: string[]
    signature_preferences: {
      likes: string[]
      dislikes: string[]
    }
  }
  
  capabilities: {
    tools: string[]
    skills: string[]
    limitations: string[]
  }
  
  memory_template: {
    key_persons: any[]
    important_events: any[]
    ongoing_tasks: any[]
    signature?: Record<string, string>
  }
  
  metadata: {
    type: 'public' | 'private' | 'paid'
    creator?: string
    source: 'cultivated' | 'constructed' | 'distilled' | 'ip_licensed'
    tags: string[]
    version: string
    created_at: string
    license: string
    description?: string
  }
  
  extensions: {
    voice_id?: string | null
    custom_fields?: Record<string, any>
  }
}

// 数据库记录类型
export interface PersonalityRecord {
  id: string
  personality_id: string
  name: string
  display_name: string | null
  role: string | null
  avatar_url: string | null
  description: string | null
  personality_data: Personality
  type: string
  source: string
  tags: string[]
  version: string
  license: string
  view_count: number
  download_count: number
  created_at: string
  updated_at: string
}
