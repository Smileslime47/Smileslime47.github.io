import { parse as parseYaml } from 'yaml'
import type { FrontmatterValue } from './types'

/**
 * markdown 解析后的统一结果。
 * - frontmatter: 文档头的键值对
 * - content: 去掉 frontmatter 后的正文
 */
export type ParsedMarkdown = {
  frontmatter: Record<string, FrontmatterValue>
  content: string
}

/**
 * 浏览器端 frontmatter 解析：
 * 1) 用正则提取开头的 --- yaml --- 块
 * 2) 用 yaml 库解析块内容
 *
 * 这样避免 gray-matter 对 Node Buffer 的运行时依赖。
 */
export function parseFrontmatter(raw: string): ParsedMarkdown {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) {
    return {
      frontmatter: {},
      content: raw,
    }
  }

  const block = match[1] ?? ''
  const content = raw.slice((match[0] ?? '').length)

  try {
    const parsed = parseYaml(block) as Record<string, unknown> | null
    return {
      frontmatter: normalizeFrontmatter(parsed ?? {}),
      content,
    }
  } catch {
    // YAML 解析失败时：忽略 frontmatter，至少保证正文可读。
    return {
      frontmatter: {},
      content,
    }
  }
}

/**
 * 将 YAML 结果归一化为当前项目使用的 FrontmatterValue 类型。
 * - 标量值统一转字符串
 * - 数组值统一转字符串数组
 * - null/undefined/对象等复杂值会被忽略
 */
function normalizeFrontmatter(data: Record<string, unknown>): Record<string, FrontmatterValue> {
  const result: Record<string, FrontmatterValue> = {}

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      result[key] = value
        .filter((item): item is string | number | boolean =>
          typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean'
        )
        .map((item) => String(item))
      continue
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      result[key] = String(value)
    }
  }

  return result
}
