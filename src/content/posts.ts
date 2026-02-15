type FrontmatterValue = string | string[]

export interface PostEntry {
  id: string
  title: string
  url: string
  filePath: string
  segments: string[]
  categorySegments: string[]
  content: string
  raw: string
  frontmatter: Record<string, FrontmatterValue>
}

export interface CategoryNode {
  name: string
  pathSegments: string[]
  children: CategoryNode[]
  posts: PostEntry[]
}

const modules = import.meta.glob('/src/posts/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function stripQuotes(value: string): string {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function parseFrontmatter(raw: string): {
  frontmatter: Record<string, FrontmatterValue>
  content: string
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) {
    return { frontmatter: {}, content: raw }
  }

  const block = match[1] ?? ''
  const content = raw.slice((match[0] ?? '').length)
  const frontmatter: Record<string, FrontmatterValue> = {}
  const lines = block.split(/\r?\n/)
  let currentArrayKey: string | null = null

  for (const line of lines) {
    const arrayItem = line.match(/^\s*-\s+(.+)$/)
    if (arrayItem && currentArrayKey && Array.isArray(frontmatter[currentArrayKey])) {
      ;(frontmatter[currentArrayKey] as string[]).push(stripQuotes(arrayItem[1] ?? ''))
      continue
    }

    const pair = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/)
    if (!pair) {
      currentArrayKey = null
      continue
    }

    const key = pair[1] ?? ''
    const value = (pair[2] ?? '').trim()
    if (key === '') {
      currentArrayKey = null
      continue
    }
    if (value === '') {
      frontmatter[key] = []
      currentArrayKey = key
    } else {
      frontmatter[key] = stripQuotes(value)
      currentArrayKey = null
    }
  }

  return { frontmatter, content }
}

function buildPosts(): PostEntry[] {
  return Object.entries(modules)
    .map(([filePath, raw]) => {
      const relativePath = filePath.replace('/src/posts/', '')
      const withoutExt = relativePath.replace(/\.md$/i, '')
      const segments = withoutExt.split('/')
      const lastSegment = segments[segments.length - 1] ?? relativePath
      const categorySegments = segments.slice(0, -1)
      const { frontmatter, content } = parseFrontmatter(raw)
      const fmTitle = frontmatter.title
      const title = typeof fmTitle === 'string' && fmTitle.trim() !== '' ? fmTitle : lastSegment
      const url = `/posts/${segments.map((segment) => encodeURIComponent(segment)).join('/')}`

      return {
        id: relativePath,
        title,
        url,
        filePath: relativePath,
        segments,
        categorySegments,
        raw,
        content,
        frontmatter,
      }
    })
    .sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '', 'zh-Hans-CN'))
}

const allPosts = buildPosts()

function sortTree(node: CategoryNode): void {
  node.children.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
  node.posts.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? '', 'zh-Hans-CN'))
  node.children.forEach(sortTree)
}

function buildCategoryTree(posts: PostEntry[]): CategoryNode[] {
  const root: CategoryNode = {
    name: '',
    pathSegments: [],
    children: [],
    posts: [],
  }

  const ensureChild = (parent: CategoryNode, name: string): CategoryNode => {
    let child = parent.children.find((node) => node.name === name)
    if (!child) {
      child = {
        name,
        pathSegments: [...parent.pathSegments, name],
        children: [],
        posts: [],
      }
      parent.children.push(child)
    }
    return child
  }

  for (const post of posts) {
    if (post.categorySegments.length === 0) {
      root.posts.push(post)
      continue
    }

    let current = root
    for (const segment of post.categorySegments) {
      current = ensureChild(current, segment)
    }
    current.posts.push(post)
  }

  sortTree(root)
  return root.children
}

const categoryTree = buildCategoryTree(allPosts)

export function getAllPosts(): PostEntry[] {
  return allPosts
}

export function getCategoryTree(): CategoryNode[] {
  return categoryTree
}

export function getPostBySegments(segments: string[]): PostEntry | undefined {
  const key = segments.join('/')
  return allPosts.find((post) => post.segments.join('/') === key)
}
