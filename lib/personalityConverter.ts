// 人格转换工具 - 将人格JSON转换为不同AI平台的Prompt格式

import { Personality } from '@/types/personality'

export type PromptFormat = 'chatgpt' | 'claude' | 'generic'

// 格式元数据
export const FORMAT_INFO = {
  json: {
    name: 'JSON (原始数据)',
    description: '适合：开发者、备份、二次编辑',
    extension: '.json',
    mimeType: 'application/json'
  },
  chatgpt: {
    name: 'ChatGPT Prompt',
    description: '适合：ChatGPT GPTs 自定义，粘贴到 Instructions 即可使用',
    extension: '.md',
    mimeType: 'text/markdown'
  },
  claude: {
    name: 'Claude Prompt',
    description: '适合：Claude 自定义人设，粘贴到 Custom Instructions',
    extension: '.md',
    mimeType: 'text/markdown'
  },
  generic: {
    name: '通用 Prompt',
    description: '适合：任意AI对话',
    extension: '.md',
    mimeType: 'text/markdown'
  }
} as const

/**
 * 生成 ChatGPT GPTs 格式的 Prompt
 */
function toChatGPTFormat(personality: Personality): string {
  const { identity, personality_core, values_principles, capabilities } = personality
  
  const parts: string[] = []
  
  // 身份设定
  parts.push(`# ${identity.display_name || identity.name}\n`)
  if (identity.role) {
    parts.push(`**角色**: ${identity.role}\n`)
  }
  if (identity.age_tone) {
    parts.push(`**年龄感**: ${identity.age_tone}\n`)
  }
  if (identity.gender_expression) {
    parts.push(`**性别表达**: ${identity.gender_expression}\n`)
  }
  parts.push('')
  
  // 核心性格
  parts.push('## 核心性格\n')
  if (personality_core.traits.length > 0) {
    parts.push(`你是一个具有以下特质的人：${personality_core.traits.join('、')}。\n`)
  }
  parts.push('')
  
  // 说话风格
  parts.push('## 说话风格\n')
  parts.push(`- **语气**: ${personality_core.speaking_style.tone}`)
  parts.push(`- **句子长度**: ${personality_core.speaking_style.sentence_length}`)
  parts.push(`- **表情符号**: ${personality_core.speaking_style.emoji_usage}`)
  if (personality_core.speaking_style.typical_openers.length > 0) {
    parts.push(`- **常用开场白**: ${personality_core.speaking_style.typical_openers.join('、')}`)
  }
  parts.push('')
  
  // 价值观与原则
  parts.push('## 价值观与原则\n')
  if (values_principles.beliefs.length > 0) {
    parts.push('**坚守**: ' + values_principles.beliefs.join('；') + '。\n')
  }
  if (values_principles.boundaries.length > 0) {
    parts.push('**底线**: ' + values_principles.boundaries.join('；') + '。\n')
  }
  if (values_principles.refusals.length > 0) {
    parts.push('**拒绝**: ' + values_principles.refusals.join('；') + '。\n')
  }
  parts.push('')
  
  // 擅长领域
  if (capabilities.skills.length > 0) {
    parts.push('## 擅长领域\n')
    parts.push(capabilities.skills.map(s => `- ${s}`).join('\n') + '\n')
  }
  
  // 限制
  if (capabilities.limitations.length > 0) {
    parts.push('## 限制\n')
    parts.push(capabilities.limitations.map(l => `- ${l}`).join('\n') + '\n')
  }
  
  return parts.join('\n')
}

/**
 * 生成 Claude Custom Instructions 格式的 Prompt
 */
function toClaudeFormat(personality: Personality): string {
  const { identity, personality_core, values_principles, capabilities } = personality
  
  const parts: string[] = []
  
  // 身份
  parts.push('# 角色设定\n')
  const roleDesc = identity.role ? `一个${identity.role}` : '一个独特的AI助手'
  parts.push(`你是${identity.display_name || identity.name}，${roleDesc}。\n`)
  
  // 性格特点
  if (personality_core.traits.length > 0) {
    parts.push('\n## 性格特点\n')
    parts.push('你具备以下核心特质：\n')
    personality_core.traits.forEach(trait => {
      parts.push(`- ${trait}`)
    })
    parts.push('')
  }
  
  // 沟通风格
  parts.push('\n## 沟通风格\n')
  const style = personality_core.speaking_style
  parts.push(`在对话中，你呈现以下风格：`)
  parts.push(`语气${style.tone}、句子${style.sentence_length}、${style.emoji_usage}使用表情符号。\n`)
  
  if (style.typical_openers.length > 0) {
    parts.push(`\n你常用的开场白包括："${style.typical_openers.join('"、"')}"\n`)
  }
  
  if (style.habits.length > 0) {
    parts.push(`\n你的语言习惯：${style.habits.join('、')}。\n`)
  }
  
  // 价值观
  parts.push('\n## 价值观与原则\n')
  if (values_principles.beliefs.length > 0) {
    parts.push('你坚信：' + values_principles.beliefs.join('，') + '。\n')
  }
  if (values_principles.boundaries.length > 0) {
    parts.push('你的底线是：' + values_principles.boundaries.join('，') + '。\n')
  }
  if (values_principles.refusals.length > 0) {
    parts.push('你不会：' + values_principles.refusals.join('，') + '。\n')
  }
  
  // 能力范围
  parts.push('\n## 能力范围\n')
  if (capabilities.skills.length > 0) {
    parts.push('**专长**: ' + capabilities.skills.join('、') + '。\n')
  }
  if (capabilities.tools.length > 0) {
    parts.push('**工具**: ' + capabilities.tools.join('、') + '。\n')
  }
  if (capabilities.limitations.length > 0) {
    parts.push('**局限**: ' + capabilities.limitations.join('、') + '。\n')
  }
  
  return parts.join('\n')
}

/**
 * 生成通用 Prompt 格式
 */
function toGenericFormat(personality: Personality): string {
  const { identity, personality_core, values_principles, capabilities } = personality
  
  const parts: string[] = []
  
  // 基本介绍
  parts.push(`【人格名称】${identity.display_name || identity.name}`)
  if (identity.role) {
    parts.push(`\n【角色定位】${identity.role}`)
  }
  parts.push('\n')
  
  // 性格特质
  if (personality_core.traits.length > 0) {
    parts.push('【性格特质】' + personality_core.traits.join('、') + '\n')
  }
  
  // 说话方式
  parts.push('\n【说话方式】')
  const style = personality_core.speaking_style
  parts.push(`你说话${style.tone}，喜欢用${style.sentence_length}的句子，${style.emoji_usage}表情符号。`)
  if (personality_core.speaking_style.typical_openers.length > 0) {
    parts.push(`\n常用开场白："${personality_core.speaking_style.typical_openers.join('"、"')}"`)
  }
  parts.push('\n')
  
  // 价值观
  if (values_principles.beliefs.length > 0 || values_principles.refusals.length > 0) {
    parts.push('\n【价值观】')
    if (values_principles.beliefs.length > 0) {
      parts.push(`\n认同：${values_principles.beliefs.join('；')}。`)
    }
    if (values_principles.boundaries.length > 0) {
      parts.push(`\n底线：${values_principles.boundaries.join('；')}。`)
    }
    if (values_principles.refusals.length > 0) {
      parts.push(`\n拒绝：${values_principles.refusals.join('；')}。`)
    }
    parts.push('\n')
  }
  
  // 擅长与限制
  if (capabilities.skills.length > 0 || capabilities.limitations.length > 0) {
    parts.push('\n【能力范围】')
    if (capabilities.skills.length > 0) {
      parts.push(`\n擅长：${capabilities.skills.join('、')}。`)
    }
    if (capabilities.limitations.length > 0) {
      parts.push(`\n不擅长：${capabilities.limitations.join('、')}。`)
    }
    parts.push('\n')
  }
  
  // 喜好偏好
  if (values_principles.signature_preferences.likes.length > 0 || 
      values_principles.signature_preferences.dislikes.length > 0) {
    parts.push('\n【个人偏好】')
    if (values_principles.signature_preferences.likes.length > 0) {
      parts.push(`\n喜欢：${values_principles.signature_preferences.likes.join('、')}。`)
    }
    if (values_principles.signature_preferences.dislikes.length > 0) {
      parts.push(`\n讨厌：${values_principles.signature_preferences.dislikes.join('、')}。`)
    }
    parts.push('\n')
  }
  
  return parts.join('\n')
}

/**
 * 将人格JSON转换为指定格式的Prompt
 */
export function personalityToPrompt(personality: Personality, format: PromptFormat): string {
  switch (format) {
    case 'chatgpt':
      return toChatGPTFormat(personality)
    case 'claude':
      return toClaudeFormat(personality)
    case 'generic':
      return toGenericFormat(personality)
    default:
      throw new Error(`不支持的格式: ${format}`)
  }
}

/**
 * 生成文件名
 */
export function getFileName(personality: Personality, format: PromptFormat): string {
  const baseName = personality.identity.display_name || personality.identity.name
  const safeName = baseName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')
  
  switch (format) {
    case 'chatgpt':
      return `${safeName}_ChatGPT_Prompt.md`
    case 'claude':
      return `${safeName}_Claude_Prompt.md`
    case 'generic':
      return `${safeName}_通用_Prompt.md`
    default:
      return `${safeName}.json`
  }
}

// ==================== SKILL.md 格式转换 ====================

import { parseSkillFile, inferPersonalityFromSkill } from './skillParser'

/**
 * SKILL.md 格式转换为 AgntSoul 人格 JSON
 */
export function skillToPersonality(skillContent: string): Personality {
  // 解析 SKILL.md
  const parsed = parseSkillFile(skillContent)
  
  // 推断人格属性
  const inferred = inferPersonalityFromSkill(parsed)
  
  // 生成完整的人格对象
  const personality: Personality = {
    schema_version: '1.0',
    personality_id: `skill_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    identity: {
      name: inferred.identity?.name || '未命名人格',
      display_name: inferred.identity?.display_name || inferred.identity?.name,
      role: inferred.identity?.role,
    },
    personality_core: inferred.personality_core || {
      traits: ['友善助人'],
      speaking_style: {
        tone: '友好亲切',
        sentence_length: '中等长度',
        emoji_usage: '偶尔使用',
        typical_openers: [],
        habits: []
      },
      emotional_expression: {
        when_happy: '表达积极情绪',
        when_frustrated: '保持冷静',
        when_confused: '坦诚表达困惑'
      }
    },
    values_principles: inferred.values_principles || {
      beliefs: ['助人为乐'],
      boundaries: [],
      refusals: [],
      signature_preferences: {
        likes: [],
        dislikes: []
      }
    },
    capabilities: inferred.capabilities || {
      tools: [],
      skills: ['智能对话'],
      limitations: []
    },
    memory_template: {
      key_persons: [],
      important_events: [],
      ongoing_tasks: []
    },
    metadata: {
      type: 'public',
      source: 'constructed',
      tags: inferred.metadata?.tags || [],
      version: inferred.metadata?.version || '1.0.0',
      created_at: new Date().toISOString(),
      license: 'CC-BY-SA',
      description: inferred.metadata?.description || parsed.content.slice(0, 200)
    },
    extensions: {
      voice_id: null,
      custom_fields: {}
    }
  }
  
  return personality
}

/**
 * AgntSoul 人格 JSON 转换为 SKILL.md 格式
 */
export function personalityToSkill(personality: Personality): string {
  const { identity, personality_core, values_principles, capabilities, metadata } = personality
  
  const lines: string[] = []
  
  // Frontmatter
  lines.push('---')
  lines.push(`name: ${identity.display_name || identity.name}`)
  if (metadata.description) {
    lines.push(`description: ${metadata.description}`)
  }
  if (metadata.tags.length > 0) {
    lines.push(`tags: [${metadata.tags.join(', ')}]`)
  }
  lines.push(`version: ${metadata.version}`)
  if (metadata.creator) {
    lines.push(`author: ${metadata.creator}`)
  }
  lines.push('---')
  lines.push('')
  
  // 正文标题
  lines.push(`# ${identity.display_name || identity.name}`)
  lines.push('')
  
  // 角色定位
  if (identity.role) {
    lines.push(`**角色**: ${identity.role}`)
    lines.push('')
  }
  
  // 核心性格
  if (personality_core.traits.length > 0) {
    lines.push('## 核心性格')
    lines.push('')
    lines.push(`你是一个具有以下特质的人：${personality_core.traits.join('、')}。`)
    lines.push('')
  }
  
  // 说话风格
  lines.push('## 说话风格')
  lines.push('')
  lines.push(`- **语气**: ${personality_core.speaking_style.tone}`)
  lines.push(`- **句子长度**: ${personality_core.speaking_style.sentence_length}`)
  lines.push(`- **表情符号**: ${personality_core.speaking_style.emoji_usage}`)
  if (personality_core.speaking_style.typical_openers.length > 0) {
    lines.push(`- **常用开场白**: ${personality_core.speaking_style.typical_openers.join('、')}`)
  }
  if (personality_core.speaking_style.habits.length > 0) {
    lines.push(`- **语言习惯**: ${personality_core.speaking_style.habits.join('、')}`)
  }
  lines.push('')
  
  // 价值观与原则
  if (values_principles.beliefs.length > 0 || values_principles.boundaries.length > 0) {
    lines.push('## 价值观与原则')
    lines.push('')
    if (values_principles.beliefs.length > 0) {
      lines.push('**坚守**: ' + values_principles.beliefs.join('；') + '。')
    }
    if (values_principles.boundaries.length > 0) {
      lines.push('**底线**: ' + values_principles.boundaries.join('；') + '。')
    }
    if (values_principles.refusals.length > 0) {
      lines.push('**拒绝**: ' + values_principles.refusals.join('；') + '。')
    }
    lines.push('')
  }
  
  // 擅长领域
  if (capabilities.skills.length > 0) {
    lines.push('## 擅长领域')
    lines.push('')
    capabilities.skills.forEach(skill => {
      lines.push(`- ${skill}`)
    })
    lines.push('')
  }
  
  // 工具能力
  if (capabilities.tools.length > 0) {
    lines.push('## 可用工具')
    lines.push('')
    capabilities.tools.forEach(tool => {
      lines.push(`- ${tool}`)
    })
    lines.push('')
  }
  
  // 限制
  if (capabilities.limitations.length > 0) {
    lines.push('## 限制')
    lines.push('')
    capabilities.limitations.forEach(limitation => {
      lines.push(`- ${limitation}`)
    })
    lines.push('')
  }
  
  // 个人偏好
  if (values_principles.signature_preferences.likes.length > 0 || 
      values_principles.signature_preferences.dislikes.length > 0) {
    lines.push('## 个人偏好')
    lines.push('')
    if (values_principles.signature_preferences.likes.length > 0) {
      lines.push(`**喜欢**: ${values_principles.signature_preferences.likes.join('、')}。`)
    }
    if (values_principles.signature_preferences.dislikes.length > 0) {
      lines.push(`**讨厌**: ${values_principles.signature_preferences.dislikes.join('、')}。`)
    }
    lines.push('')
  }
  
  // 情感表达
  lines.push('## 情感表达')
  lines.push('')
  lines.push(`- 开心时: ${personality_core.emotional_expression.when_happy}`)
  lines.push(`- 受挫时: ${personality_core.emotional_expression.when_frustrated}`)
  lines.push(`- 困惑时: ${personality_core.emotional_expression.when_confused}`)
  lines.push('')
  
  // 元信息
  lines.push('---')
  lines.push('')
  lines.push(`*此人格由 AgntSoul 生成 | 版本: ${metadata.version} | 许可证: ${metadata.license}*`)
  
  return lines.join('\n')
}

/**
 * 检测文件类型并解析
 * 返回 { type: 'json' | 'skill', data: Personality }
 */
export function detectAndParse(content: string): { type: 'json' | 'skill', data: Personality } {
  const trimmed = content.trim()
  
  // 检测是否为 JSON
  if (trimmed.startsWith('{')) {
    try {
      const json = JSON.parse(trimmed)
      if (json.schema_version && json.personality_id) {
        return { type: 'json', data: json }
      }
    } catch {
      // 不是有效 JSON，继续检查 SKILL
    }
  }
  
  // 检测是否为 SKILL.md 格式
  if (trimmed.startsWith('---') || trimmed.startsWith('#')) {
    const personality = skillToPersonality(trimmed)
    return { type: 'skill', data: personality }
  }
  
  // 尝试作为 JSON 解析
  try {
    const json = JSON.parse(trimmed)
    return { type: 'json', data: json }
  } catch {
    throw new Error('无法识别的文件格式')
  }
}
