// SKILL.md 解析器
import matter from 'gray-matter';
import { SkillConfig } from '@/types';

export function parseSkillMd(content: string): SkillConfig | null {
  try {
    const { data, content: body } = matter(content);
    const sections = parseSections(body);

    return {
      name: data.name || data.title || '未命名',
      description: data.description || sections.description || '',
      author: data.author,
      category: data.category || data.type,
      tags: data.tags || [],
      personality: sections.personality,
      system_prompt: sections.system_prompt,
      tools: data.tools || sections.tools,
      knowledge_base: data.knowledge_base || sections.knowledge_base,
      examples: sections.examples,
    };
  } catch {
    return null;
  }
}

function parseSections(body: string): Record<string, any> {
  const sections: Record<string, any> = {};
  const regex = /^##\s+(.+)\n([\s\S]*?)(?=^##\s|$)/gm;
  let match;

  while ((match = regex.exec(body)) !== null) {
    const title = match[1].toLowerCase().replace(/\s+/g, '_');
    const content = match[2].trim();

    switch (title) {
      case 'description':
        sections.description = content;
        break;
      case 'personality':
        sections.personality = content;
        break;
      case 'system_prompt':
        sections.system_prompt = content;
        break;
      case 'tools':
        sections.tools = content.split('\n').filter(Boolean).map(s => s.replace(/^[-*]\s*/, ''));
        break;
      case 'knowledge_base':
        sections.knowledge_base = content.split('\n').filter(Boolean).map(s => s.replace(/^[-*]\s*/, ''));
        break;
      case 'examples':
        sections.examples = parseExamples(content);
        break;
    }
  }

  return sections;
}

function parseExamples(content: string) {
  const examples: Array<{ user: string; assistant: string }> = [];
  const lines = content.split('\n');
  let current: Partial<{ user: string; assistant: string }> = {};

  for (const line of lines) {
    if (line.startsWith('**User**:') || line.startsWith('**User**：')) {
      if (current.user && current.assistant) {
        examples.push(current as any);
        current = {};
      }
      current.user = line.replace(/\*\*User\*\*[:：]\s*/, '').trim();
    } else if (line.startsWith('**Assistant**:') || line.startsWith('**Assistant**：')) {
      current.assistant = line.replace(/\*\*Assistant\*\*[:：]\s*/, '').trim();
    }
  }

  if (current.user && current.assistant) {
    examples.push(current as any);
  }

  return examples;
}

// 生成 SKILL.md 内容
export function generateSkillMd(skill: any): string {
  const { config } = skill;
  let md = `---
name: ${skill.name}
description: ${skill.description}
author: ${skill.author || 'Unknown'}
category: ${skill.category || 'General'}
tags:
${(skill.tags || []).map((t: string) => `  - ${t}`).join('\n')}
---

# ${skill.name}

${skill.description}

`;

  if (config?.personality) {
    md += `## Personality\n\n${config.personality}\n\n`;
  }

  if (config?.system_prompt) {
    md += `## System Prompt\n\n\`\`\`\n${config.system_prompt}\n\`\`\`\n\n`;
  }

  if (config?.tools?.length) {
    md += `## Tools\n\n${config.tools.map((t: string) => `- ${t}`).join('\n')}\n\n`;
  }

  if (config?.examples?.length) {
    md += `## Examples\n\n`;
    config.examples.forEach((ex: any, i: number) => {
      md += `### 示例 ${i + 1}\n\n**User**: ${ex.user}\n\n**Assistant**: ${ex.assistant}\n\n`;
    });
  }

  return md;
}
