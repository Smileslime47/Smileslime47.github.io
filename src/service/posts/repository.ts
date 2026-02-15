import { parseFrontmatter } from './frontmatter-parser'
import { buildCategoryTree, buildPostSummaries } from './index-builder'
import type { PostLoaderMap } from './loaders'
import type { PostEntry, PostSummary, PostsService, CategoryNode, PostMeta, FrontmatterValue } from './types'

/**
 * 文章仓储实现（PostsService 的核心实现）。
 *
 * 职责边界：
 * 1) 初始化阶段：基于 loaders 构建摘要索引和分类树
 * 2) 查询阶段：提供摘要/分类查询接口
 * 3) 详情阶段：按需加载 markdown，解析 frontmatter，并做结果缓存
 */
export class PostRepository implements PostsService {
  /** 全部文章摘要（初始化时一次构建）。 */
  private readonly summaries: PostSummary[]
  /** 分类树（初始化时一次构建）。 */
  private readonly categoryTree: CategoryNode[]
  /** 路由 key(segments.join('/')) -> 摘要映射，提升查找稳定性。 */
  private readonly summaryByKey: Map<string, PostSummary>
  /** 文章 id -> loader 映射，用于详情页按需拉取正文。 */
  private readonly loaderById: Map<string, () => Promise<string>>
  /** 文章详情缓存，避免重复请求和重复解析。 */
  private readonly postCache = new Map<string, Promise<PostEntry>>()
  /** 全量元信息缓存，避免归档/标签页重复解析。 */
  private allMetaCache?: Promise<PostMeta[]>

  /**
   * 构造阶段只做“轻量工作”：
   * - 读取路径并构建索引
   * - 不加载正文内容
   */
  constructor(loaders: PostLoaderMap) {
    this.summaries = buildPostSummaries(loaders)
    this.categoryTree = buildCategoryTree(this.summaries)
    this.summaryByKey = new Map(this.summaries.map((post) => [post.segments.join('/'), post]))
    this.loaderById = new Map(
      Object.entries(loaders).map(([filePath, loader]) => [filePath.replace('/src/posts/', ''), loader])
    )
  }

  /** 返回所有文章摘要（已排序）。 */
  getAllPosts(): PostSummary[] {
    return this.summaries
  }

  async loadAllPostMetas(): Promise<PostMeta[]> {
    if (this.allMetaCache) return this.allMetaCache

    this.allMetaCache = Promise.all(
      this.summaries.map(async (summary) => {
        const loader = this.loaderById.get(summary.id)
        if (!loader) {
          throw new Error(`Cannot find post loader for ${summary.id}`)
        }

        const raw = await loader()
        const { frontmatter } = parseFrontmatter(raw)
        const { publishedAt, publishedAtTs } = resolvePublishedAt(frontmatter)
        const fmTitle = frontmatter.title
        const title = typeof fmTitle === 'string' && fmTitle.trim() !== '' ? fmTitle : summary.title

        return {
          ...summary,
          title,
          frontmatter,
          publishedAt,
          publishedAtTs,
        }
      })
    ).then((items) =>
      items.sort((a, b) => {
        if (a.publishedAtTs != null && b.publishedAtTs != null) {
          return b.publishedAtTs - a.publishedAtTs
        }
        if (a.publishedAtTs != null) return -1
        if (b.publishedAtTs != null) return 1
        return a.title.localeCompare(b.title, 'zh-Hans-CN')
      })
    )

    return this.allMetaCache
  }

  /** 返回分类树（已排序）。 */
  getCategoryTree(): CategoryNode[] {
    return this.categoryTree
  }

  /**
   * 按路由段查摘要。
   * segments 示例：['Article', 'Web', 'hello']
   */
  getPostSummaryBySegments(segments: string[]): PostSummary | undefined {
    for (const key of this.buildLookupKeys(segments)) {
      const direct = this.summaryByKey.get(key)
      if (direct) return direct
    }

    // 最后兜底：线性扫描一次，避免极端路径编码差异导致 miss。
    const keySet = new Set(this.buildLookupKeys(segments))
    return this.summaries.find((post) => keySet.has(this.normalizeKey(post.segments.join('/'))))
  }

  /**
   * 按路由段加载文章详情。
   * 流程：
   * 1) 先通过摘要索引定位文章
   * 2) 查缓存，命中则直接复用
   * 3) 未命中则调用 loader 拉取 raw markdown
   * 4) 解析 frontmatter 和正文
   * 5) 若 frontmatter.title 存在，用其覆盖默认标题
   */
  async loadPostBySegments(segments: string[]): Promise<PostEntry | undefined> {
    const summary = this.getPostSummaryBySegments(segments)
    if (!summary) return undefined

    const cached = this.postCache.get(summary.id)
    if (cached) return cached

    const loader = this.loaderById.get(summary.id)
    if (!loader) throw new Error(`Cannot find post loader for ${summary.id}`)

    const promise = loader().then((raw) => {
      const { frontmatter, content } = parseFrontmatter(raw)
      const fmTitle = frontmatter.title
      const title = typeof fmTitle === 'string' && fmTitle.trim() !== '' ? fmTitle : summary.title

      return {
        ...summary,
        title,
        raw,
        content,
        frontmatter,
      }
    })

    this.postCache.set(summary.id, promise)
    return promise
  }

  /**
   * 生成一组候选 key，用于兼容：
   * 1) pathMatch 可能是单段里包含斜杠
   * 2) 路由参数可能已解码或未解码
   * 3) 反斜杠与正斜杠差异
   */
  private buildLookupKeys(segments: string[]): string[] {
    const joined = segments.join('/')
    const splitFromJoined = joined.split('/')
    const decodedJoined = this.safeDecode(joined)
    const decodedBySegment = splitFromJoined.map((part) => this.safeDecode(part)).join('/')

    const keys = [
      joined,
      decodedJoined,
      decodedBySegment,
      decodedJoined.replace(/%2F/gi, '/'),
      decodedBySegment.replace(/%2F/gi, '/'),
    ].map((key) => this.normalizeKey(key))

    return [...new Set(keys.filter((key) => key.length > 0))]
  }

  private normalizeKey(key: string): string {
    return key.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')
  }

  private safeDecode(value: string): string {
    try {
      return decodeURIComponent(value)
    } catch {
      return value
    }
  }
}

const DATE_KEYS = ['date', 'publishedAt', 'publishDate', 'createdAt'] as const

function resolvePublishedAt(frontmatter: Record<string, FrontmatterValue>): {
  publishedAt?: string
  publishedAtTs: number | null
} {
  for (const key of DATE_KEYS) {
    const raw = frontmatter[key]
    if (typeof raw !== 'string' || raw.trim() === '') continue
    const normalized = raw.trim()
    const ts = Date.parse(normalized)
    return {
      publishedAt: normalized,
      publishedAtTs: Number.isNaN(ts) ? null : ts,
    }
  }
  return { publishedAtTs: null }
}
