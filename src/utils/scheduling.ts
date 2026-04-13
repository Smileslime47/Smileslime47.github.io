export function runWhenIdle(task: () => void, timeout = 1200, fallbackDelay = 180): void {
  if ('requestIdleCallback' in window) {
    ;(window as Window & {
      requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number
    }).requestIdleCallback(task, { timeout })
    return
  }

  setTimeout(task, fallbackDelay)
}
