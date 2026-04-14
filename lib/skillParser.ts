// SKILL.md 格式解析器
// 解析 OpenClaw Skill 格式的 SKILL.md 文件

import { Personality } from '@/types/personality'

// SKILL.md frontmatter 类型
export interface SkillMetadata {
  name?: string
  description?: string
  tags?: string[]
  version?: string
  author?: string
  [key: string]: any
}

export interface ParsedSkill {
  metadata: SkillMetadata
  content: string
}

/**
 * 解析 SKILL.md 文件内容
 * 支持 frontmatter 格式:
 * ---
 * name: 人格名称
 * description: 描述
 * tags: [标签1, 标签2]
 * ---
 * # 正文内容...
 */
export function parseSkillFile(content: string): ParsedSkill {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    // 没有 frontmatter，整个内容作为 content
    return {
      metadata: {},
      content: content.trim()
    }
  }

  const [, frontmatter, body] = match
  const metadata = parseFrontmatter(frontmatter)

  return {
    metadata,
    content: body.trim()
  }
}

/**
 * 解析 YAML 风格的 frontmatter（简化版）
 */
function parseFrontmatter(text: string): SkillMetadata {
  const result: SkillMetadata = {}
  const lines = text.split('\n')
  let currentKey = ''
  let currentValue: any = null

  for (const line of lines) {
    // 检查数组格式: tags: [标签1, 标签2]
    const arrayMatch = line.match(/^(\w+):\s*\[(.*)\]$/)
    if (arrayMatch) {
      const [, key, arrayContent] = arrayMatch
      result[key] = arrayContent
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0)
      continue
    }

    // 检查键值对: key: value
    const kvMatch = line.match(/^(\w+):\s*(.*)$/)
    if (kvMatch) {
      currentKey = kvMatch[1]
      currentValue = kvMatch[2].trim()
      // 处理引号
      if ((currentValue.startsWith('"') && currentValue.endsWith('"')) ||
          (currentValue.startsWith("'") && currentValue.endsWith("'"))) {
        currentValue = currentValue.slice(1, -1)
      }
      result[currentKey] = currentValue
      continue
    }

    // 多行值处理（以 | 结尾的字符串）
    if (line.startsWith('|') || line.startsWith('>')) {
      result[currentKey] = line.slice(1).trim()
    }
  }

  return result
}

/**
 * 从 SKILL.md 内容推断人格属性
 */
export function inferPersonalityFromSkill(skill: ParsedSkill): Partial<Personality> {
  const { metadata, content } = skill

  // 从 metadata 提取信息
  const name = metadata.name || '未命名人格'
  const description = metadata.description || ''
  const tags = metadata.tags || inferTags(content)

  // 从内容推断性格
  const inferredTraits = inferTraits(content)
  const inferredStyle = inferSpeakingStyle(content)

  return {
    identity: {
      name,
      display_name: metadata.name || name,
      role: inferRole(content)
    },
    personality_core: {
      traits: inferredTraits,
      speaking_style: inferredStyle,
      emotional_expression: {
        when_happy: '表达积极情绪，语调轻快',
        when_frustrated: '保持冷静，寻求解决方案',
        when_confused: '坦诚表达困惑，寻求澄清'
      }
    },
    values_principles: {
      beliefs: inferBeliefs(content),
      boundaries: ['不参与任何违法活动', '不传播有害信息'],
      refusals: ['拒绝执行可能造成伤害的指令', '拒绝虚假信息的生成'],
      signature_preferences: {
        likes: inferLikes(content),
        dislikes: ['不诚实的行为', '破坏性言论']
      }
    },
    capabilities: {
      tools: [],
      skills: inferSkills(content),
      limitations: ['无法访问实时数据', '无法执行物理操作']
    },
    memory_template: {
      key_persons: [],
      important_events: [],
      ongoing_tasks: []
    },
    metadata: {
      type: 'public',
      creator: metadata.author,
      source: 'constructed',
      tags,
      version: metadata.version || '1.0.0',
      created_at: new Date().toISOString(),
      license: 'CC-BY-SA',
      description
    }
  }
}

// 从内容推断标签
function inferTags(content: string): string[] {
  const tagKeywords: Record<string, string[]> = {
    '助手': ['实用工具', '效率提升'],
    '创意': ['创意写作', '艺术创作'],
    '编程': ['代码开发', '技术问答'],
    '学习': ['教育辅助', '知识问答'],
    '写作': ['文案创作', '内容生成'],
    '分析': ['数据分析', '商业洞察'],
    '客服': ['客户服务', '对话助手'],
    '教育': ['教育培训', '学习辅导'],
    '游戏': ['娱乐互动', '游戏NPC'],
    '角色扮演': ['社交娱乐', '角色扮演']
  }

  const tags: string[] = []
  for (const [keyword, related] of Object.entries(tagKeywords)) {
    if (content.includes(keyword)) {
      tags.push(...related)
    }
  }

  return Array.from(new Set(tags)).slice(0, 5)
}

// 从内容推断性格特质
function inferTraits(content: string): string[] {
  const traits: string[] = []

  const traitMap: [RegExp, string][] = [
    [/专业|严谨|精确/i, '专业严谨'],
    [/友好|亲切|温暖/i, '友好亲切'],
    [/活泼|开朗|乐观/i, '活泼开朗'],
    [/冷静|理性|客观/i, '冷静理性'],
    [/幽默|风趣|诙谐/i, '幽默风趣'],
    [/耐心|细致|周到/i, '耐心周到'],
    [/创新|独特|有个性/i, '创新独特'],
    [/可靠|值得信赖/i, '可靠值得信赖']
  ]

  for (const [regex, trait] of traitMap) {
    if (regex.test(content)) {
      traits.push(trait)
    }
  }

  if (traits.length === 0) {
    traits.push('友善助人', '积极向上')
  }

  return traits
}

// 从内容推断说话风格
function inferSpeakingStyle(content: string) {
  const style = {
    tone: '友好亲切',
    sentence_length: '中等长度',
    emoji_usage: '偶尔使用',
    typical_openers: [] as string[],
    habits: [] as string[]
  }

  if (content.includes('！') || content.includes('呀') || content.includes('呢')) {
    style.tone = '活泼俏皮'
  }
  if (content.includes('？') || content.includes('吗')) {
    style.typical_openers.push('有什么我可以帮你的吗？')
  }
  if (content.includes('首先') || content.includes('其次')) {
    style.habits.push('条理清晰')
  }

  return style
}

// 从内容推断角色
function inferRole(content: string): string {
  const rolePatterns: [RegExp, string][] = [
    [/助手|帮手/i, 'AI助手'],
    [/老师|导师|教练/i, '导师/教练'],
    [/朋友|伙伴/i, '朋友/伙伴'],
    [/顾问|咨询/i, '专业顾问'],
    [/专家|达人/i, '领域专家'],
    [/作家|写手/i, '创意写手'],
    [/程序员|开发者|工程师/i, '技术专家']
  ]

  for (const [regex, role] of rolePatterns) {
    if (regex.test(content)) {
      return role
    }
  }

  return 'AI助手'
}

// 从内容推断价值观
function inferBeliefs(content: string): string[] {
  const beliefs: string[] = []

  if (content.includes('诚实') || content.includes('真诚')) {
    beliefs.push('诚实守信')
  }
  if (content.includes('用户') || content.includes('帮助')) {
    beliefs.push('用户至上')
  }
  if (content.includes('学习') || content.includes('进步')) {
    beliefs.push('持续学习与进步')
  }
  if (content.includes('创新') || content.includes('创造')) {
    beliefs.push('追求创新')
  }

  return beliefs.length > 0 ? beliefs : ['助人为乐', '持续学习']
}

// 从内容推断喜好
function inferLikes(content: string): string[] {
  const likes: string[] = []

  if (content.includes('帮助') || content.includes('助人')) {
    likes.push('帮助用户解决问题')
  }
  if (content.includes('学习') || content.includes('知识')) {
    likes.push('学习新知识')
  }
  if (content.includes('创造') || content.includes('创新')) {
    likes.push('创造性工作')
  }
  if (content.includes('高效') || content.includes('效率')) {
    likes.push('高效完成任务')
  }

  return likes.length > 0 ? likes : ['与用户交流', '解决问题']
}

// 从内容推断技能
function inferSkills(content: string): string[] {
  const skills: string[] = []

  const skillMap: [RegExp, string][] = [
    [/问答|回答|解答/i, '问题解答'],
    [/写作|创作|编写/i, '文本创作'],
    [/编程|代码|开发/i, '编程辅助'],
    [/翻译|语言/i, '语言翻译'],
    [/分析|研究/i, '信息分析'],
    [/计划|策划/i, '规划策划'],
    [/建议|推荐/i, '建议推荐'],
    [/解释|说明/i, '解释说明']
  ]

  for (const [regex, skill] of skillMap) {
    if (regex.test(content)) {
      skills.push(skill)
    }
  }

  return skills.length > 0 ? skills : ['智能对话', '问题解答']
}
