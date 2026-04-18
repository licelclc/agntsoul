// 技能类型
export interface Skill {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  author: string;
  category: string;
  tags: string[];
  skill_url?: string;
  skill_content?: string;
  config?: SkillConfig;
  status: 'draft' | 'published' | 'archived';
  download_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

// 技能配置
export interface SkillConfig {
  personality?: string;
  system_prompt?: string;
  tools?: string[];
  knowledge_base?: string[];
  examples?: Conversation[];
}

// 对话示例
export interface Conversation {
  user: string;
  assistant: string;
}

// 分类
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  sort_order: number;
  created_at: string;
}

// 分页
export interface Pagination {
  page: number;
  limit: number;
  total: number;
}
