import { postLoaders } from './loaders'
import { PostRepository } from './repository'
import type { PostsService } from './types'

/**
 * 对外统一导出的类型。
 * 页面层/组件层优先从这里引用，避免跨文件直接耦合内部实现。
 */
export type { PostEntry, PostSummary, CategoryNode, PostsService, FrontmatterValue } from './types'

/**
 * 全局单例服务：
 * - 构造时建立索引和分类树
 * - 运行时按需加载文章详情
 */
export const postsService: PostsService = new PostRepository(postLoaders)
