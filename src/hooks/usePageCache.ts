import { useCallback, useEffect, useState } from 'react';

import type { CachedPage, PageCacheStore } from '../types';
import { getCachedPage, loadPageCache, savePageCache, upsertCachedPage } from '../utils/cache';
import { getHomeUrl } from '../utils/url';

export function usePageCache() {
  const [cacheStore, setCacheStore] = useState<PageCacheStore | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    loadPageCache()
      .then((store) => {
        setCacheStore(store);
        setIsHydrated(true);
      })
      .catch(() => {
        setCacheStore({ lastUrl: getHomeUrl(), entries: {} });
        setIsHydrated(true);
      });
  }, []);

  const rememberPage = useCallback(async (page: CachedPage) => {
    setCacheStore((current) => {
      if (!current) {
        return current;
      }

      const nextStore = upsertCachedPage(current, page);
      void savePageCache(nextStore);
      return nextStore;
    });
  }, []);

  const getPageForUrl = useCallback(
    (url: string): CachedPage | null => {
      if (!cacheStore) {
        return null;
      }
      return getCachedPage(cacheStore, url);
    },
    [cacheStore]
  );

  const lastUrl = cacheStore?.lastUrl ?? getHomeUrl();

  return {
    cacheStore,
    isHydrated,
    lastUrl,
    rememberPage,
    getPageForUrl
  };
}