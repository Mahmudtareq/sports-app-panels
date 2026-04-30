import NodeCache from "node-cache";

// Singleton instance - only one cache instance for entire app
let cacheInstance: NodeCache | null = null;

export const getCache = (): NodeCache => {
  if (!cacheInstance) {
    cacheInstance = new NodeCache({
      stdTTL: 3600 * 24 * 30, // Default TTL: 30 days
    });
  }
  return cacheInstance;
};

export const invalidateCache = (key: string) => {
  const cache = getCache();
  return cache.del(key);
};

export const flushAllCache = () => {
  const cache = getCache();
  return cache.flushAll();
};

export const getCacheStats = () => {
  const cache = getCache();
  return cache.getStats();
};
