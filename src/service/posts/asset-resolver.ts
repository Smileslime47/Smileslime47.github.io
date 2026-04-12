import { postAssetUrls } from './loaders'

const assetUrlByPath = new Map(
  Object.entries(postAssetUrls).map(([virtualPath, assetUrl]) => [normalizeVirtualPath(virtualPath), assetUrl])
)

export function resolvePostAssetUrl(postId: string | undefined, rawUrl: string): string {
  const trimmed = rawUrl.trim()
  if (!postId || trimmed === '' || isExternalAssetUrl(trimmed)) {
    return rawUrl
  }

  const unwrapped = unwrapMarkdownUrl(trimmed)
  const [pathPart, suffix = ''] = splitUrlSuffix(unwrapped)
  const postDir = normalizeVirtualPath(`/src/posts/${postId}`).replace(/\/[^/]+$/, '')
  const resolvedVirtualPath = resolveRelativePath(postDir, pathPart)
  const assetUrl = assetUrlByPath.get(resolvedVirtualPath)

  return assetUrl ? `${assetUrl}${suffix}` : rawUrl
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
