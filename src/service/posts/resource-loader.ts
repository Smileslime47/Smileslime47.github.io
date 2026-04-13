export type LazyResourceLoader<T> = () => Promise<T>

export class LazyResourceService<T> {
  private readonly loaderByKey: Map<string, LazyResourceLoader<T>>
  private readonly cache = new Map<string, Promise<T | undefined>>()

  constructor(loaders: Record<string, LazyResourceLoader<T>>) {
    this.loaderByKey = new Map(Object.entries(loaders))
  }

  has(key: string): boolean {
    return this.loaderByKey.has(key)
  }

  load(key: string): Promise<T | undefined> {
    const cached = this.cache.get(key)
    if (cached) return cached

    const loader = this.loaderByKey.get(key)
    if (!loader) {
      const missing = Promise.resolve(undefined)
      this.cache.set(key, missing)
      return missing
    }

    const promise = loader().catch((error) => {
      this.cache.delete(key)
      throw error
    })
    this.cache.set(key, promise)
    return promise
  }

  async loadMany(keys: string[]): Promise<Map<string, T>> {
    const entries = await Promise.all(
      keys.map(async (key): Promise<[string, T] | undefined> => {
        const value = await this.load(key)
        if (value == null) return undefined
        return [key, value]
      })
    )

    return new Map(entries.filter((entry): entry is [string, T] => entry != null))
  }
}
