import { postAssetLoaders } from './loaders'
import { LazyResourceService } from './resource-loader'

const postAssetResource = new LazyResourceService<string>(
  Object.fromEntries(
    Object.entries(postAssetLoaders).map(([virtualPath, loader]) => [normalizeVirtualPath(virtualPath), loader])
  )
)

export async function resolvePostAssetUrl(postId: string | undefined, rawUrl: string): Promise<string> {
  const trimmed = rawUrl.trim()
  if (!postId || trimmed === '' || isExternalAssetUrl(trimmed)) {
    return rawUrl
  }

  const unwrapped = unwrapMarkdownUrl(trimmed)
  const [pathPart, suffix = ''] = splitUrlSuffix(unwrapped)
  const postDir = normalizeVirtualPath(`/src/posts/${postId}`).replace(/\/[^/]+$/, '')
  const resolvedVirtualPath = resolveRelativePath(postDir, pathPart)
  const assetUrl = await postAssetResource.load(resolvedVirtualPath)

  return assetUrl ? `${assetUrl}${suffix}` : rawUrl
}

export async function resolvePostAssetUrls(postId: string | undefined, rawUrls: string[]): Promise<Map<string, string>> {
  if (!postId || rawUrls.length === 0) return new Map()

  const uniqueUrls = [...new Set(rawUrls)]
  const pairs = await Promise.all(
    uniqueUrls.map(async (rawUrl): Promise<[string, string] | undefined> => {
      const resolved = await resolvePostAssetUrl(postId, rawUrl)
      if (resolved === rawUrl) return undefined
      return [rawUrl, resolved]
    })
  )

  return new Map(pairs.filter((entry): entry is [string, string] => entry != null))
}

function isExternalAssetUrl(url: string): boolean {
  return (
    url.startsWith('/') ||
    url.startsWith('#') ||
    /^[a-z]+:/i.test(url) ||
    url.startsWith('//')
  )
}

function unwrapMarkdownUrl(url: string): string {
  if (url.startsWith('<') && url.endsWith('>')) {
    return url.slice(1, -1).trim()
  }
  return url
}

function splitUrlSuffix(url: string): [string, string?] {
  const hashIndex = url.indexOf('#')
  const queryIndex = url.indexOf('?')
  const cutIndex = [hashIndex, queryIndex].filter((index) => index >= 0).sort((a, b) => a - b)[0]

  if (cutIndex == null) return [url]
  return [url.slice(0, cutIndex), url.slice(cutIndex)]
}

function resolveRelativePath(baseDir: string, relativePath: string): string {
  const stack = baseDir.split('/').filter(Boolean)
  const rawParts = safeDecode(relativePath).replace(/\\/g, '/').split('/')

  for (const part of rawParts) {
    if (!part || part === '.') continue
    if (part === '..') {
      stack.pop()
      continue
    }
    stack.push(part)
  }

  return `/${stack.join('/')}`
}

function normalizeVirtualPath(path: string): string {
  return `/${path.replace(/\\/g, '/').replace(/^\/+/, '')}`
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}
