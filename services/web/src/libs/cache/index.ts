export class Cache {
  private cache: Map<string, { value: unknown; expiresAt: number }> = new Map();

  put(key: string, value: unknown, options?: { expiresIn?: number }): void {
    this.cache.set(key, {
      value,
      expiresAt: options?.expiresIn ? Date.now() + options.expiresIn : Infinity,
    });
  }

  get<T = unknown>(key: string): T | null {
    const cachedValue = this.cache.get(key);

    if (cachedValue && cachedValue.expiresAt > Date.now()) {
      return cachedValue.value as T;
    }

    this.cache.delete(key);
    return null;
  }
}
