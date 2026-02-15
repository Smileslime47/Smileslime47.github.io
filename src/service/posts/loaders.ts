/**
 * 单篇文章的加载函数。
 * 返回 Promise<string>，值为 markdown 原文（raw 文本）。
 */
export type PostLoader = () => Promise<string>

/**
 * 全量文章加载器映射：
 * key: 文件绝对虚拟路径（例如 /src/posts/xx/yy.md）
 * value: 对应文件的懒加载函数
 */
export type PostLoaderMap = Record<string, PostLoader>

/**
 * Vite 提供的按需导入映射。
 * 关键点：
 * - 非 eager：不会在首屏一次性加载全部 markdown
 * - query: '?raw'：以纯文本方式读取 markdown
 * - import: 'default'：读取默认导出（即文件文本）
 */
export const postLoaders = import.meta.glob('/src/posts/**/*.md', {
  query: '?raw',
  import: 'default',
}) as PostLoaderMap
