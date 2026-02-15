/**
 * Frontmatter 字段支持的值类型。
 * 当前实现只支持：
 * 1) 单字符串，例如 title: Hello
 * 2) 字符串数组，例如 tags:
 *      - vue
 *      - vite
 */
export type FrontmatterValue = string | string[]

/**
 * 文章摘要信息（轻量对象）。
 * 用于列表页、分类树等“只需要元信息”的场景，不包含正文内容。
 */
export interface PostSummary {
  /** 文章唯一标识，约定为相对路径（含 .md 后缀）。 */
  id: string
  /** 展示标题（默认取文件名；详情加载后可被 frontmatter.title 覆盖）。 */
  title: string
  /** 前端路由地址，例如 /posts/Article/Web/xxx */
  url: string
  /** 相对路径（去掉 /src/posts/ 前缀，保留 .md） */
  filePath: string
  /** 路由段数组（不含 .md），例如 ['Article', 'Web', 'xxx'] */
  segments: string[]
  /** 分类段数组（去掉最后的文件名），例如 ['Article', 'Web'] */
  categorySegments: string[]
}

/**
 * 文章详情对象（重量对象）。
 * 在 PostSummary 基础上增加正文和 frontmatter，通常只在详情页按需加载。
 */
export interface PostEntry extends PostSummary {
  /** frontmatter 之后的 markdown 正文 */
  content: string
  /** 原始 markdown 文本（包含 frontmatter） */
  raw: string
  /** frontmatter 解析结果 */
  frontmatter: Record<string, FrontmatterValue>
}

/**
 * 文章元信息对象（中量对象）。
 * 用于归档、标签页等需要 frontmatter 但不需要正文渲染的场景。
 */
export interface PostMeta extends PostSummary {
  /** frontmatter 解析结果 */
  frontmatter: Record<string, FrontmatterValue>
  /** 解析出的发布时间（优先 date/publishedAt/publishDate/createdAt） */
  publishedAt?: string
  /** 发布时间的时间戳，便于排序；无有效日期时为 null */
  publishedAtTs: number | null
}

/**
 * 分类树节点。
 * 每个节点既可能有子分类，也可能直接挂文章（posts）。
 */
export interface CategoryNode {
  /** 当前分类名（单段） */
  name: string
  /** 从根到当前节点的完整路径段 */
  pathSegments: string[]
  /** 子分类节点 */
  children: CategoryNode[]
  /** 直接属于该分类的文章（不包含子分类里的文章） */
  posts: PostSummary[]
}

/**
 * 对外统一的文章服务接口。
 * 页面层应尽量依赖该接口，而不是直接耦合具体实现类。
 */
export interface PostsService {
  /** 获取全部文章摘要（已排序）。 */
  getAllPosts(): PostSummary[]
  /** 获取全量文章元信息（按发布日期倒序）。 */
  loadAllPostMetas(): Promise<PostMeta[]>
  /** 获取分类树（已排序）。 */
  getCategoryTree(): CategoryNode[]
  /** 通过路由 segments 查询摘要。 */
  getPostSummaryBySegments(segments: string[]): PostSummary | undefined
  /** 通过路由 segments 按需加载文章详情（含缓存）。 */
  loadPostBySegments(segments: string[]): Promise<PostEntry | undefined>
}
