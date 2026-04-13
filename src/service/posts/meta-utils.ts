import type { FrontmatterValue } from './types'

const DATE_KEYS = ['date', 'publishedAt', 'publishDate', 'createdAt'] as const

export function normalizeTags(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof raw === 'string') {
    return raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

export function toTimestamp(value?: string): number | null {
  if (!value) return null
  const ts = Date.parse(value)
  return Number.isNaN(ts) ? null : ts
}

export function resolvePublishedAt(frontmatter: Record<string, FrontmatterValue>): {
  publishedAt?: string
  publishedAtTs: number | null
} {
  for (const key of DATE_KEYS) {
    const raw = frontmatter[key]
    if (typeof raw !== 'string' || raw.trim() === '') continue
    const publishedAt = raw.trim()
    return {
      publishedAt,
      publishedAtTs: toTimestamp(publishedAt),
    }
  }

  return { publishedAtTs: null }
}

export function resolvePublishedAtFromValue(
  publishedAtFromManifest: string | undefined,
  frontmatter: Record<string, FrontmatterValue>
): {
  publishedAt?: string
  publishedAtTs: number | null
} {
  if (publishedAtFromManifest && publishedAtFromManifest.trim() !== '') {
    const publishedAt = publishedAtFromManifest.trim()
    return {
      publishedAt,
      publishedAtTs: toTimestamp(publishedAt),
    }
  }

  return resolvePublishedAt(frontmatter)
}

export function buildExcerpt(content: string): string {
  const normalized = content
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (normalized.length <= 120) return normalized
  return `${normalized.slice(0, 120).trim()}...`
}
