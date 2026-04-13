export const THEME_STORAGE_KEY = '47-blog-theme'

export type ThemeMode = 'dark' | 'light'

export function resolveThemePreference(): ThemeMode {
  const persistedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (persistedTheme === 'dark' || persistedTheme === 'light') {
    return persistedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyThemeToDocument(theme: ThemeMode): void {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function readThemeFromDocument(): ThemeMode {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}
