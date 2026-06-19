import AsyncStorage from '@react-native-async-storage/async-storage';

import { CACHE_MAX_ENTRIES, CACHE_STORAGE_KEY, CACHE_TTL_MS } from '../constants';
import type { CachedPage, PageCacheStore } from '../types';
import { getHomeUrl, normalizeUrl } from './url';

const EMPTY_STORE: PageCacheStore = {
  lastUrl: getHomeUrl(),
  entries: {}
};

function pruneExpiredEntries(store: PageCacheStore, now = Date.now()): PageCacheStore {
  const entries = Object.fromEntries(
    Object.entries(store.entries).filter(([, page]) => now - page.cachedAt <= CACHE_TTL_MS)
  );

  return {
    lastUrl: store.lastUrl,
    entries
  };
}

function trimEntries(store: PageCacheStore): PageCacheStore {
  const sorted = Object.values(store.entries).sort((a, b) => b.cachedAt - a.cachedAt);
  const trimmed = sorted.slice(0, CACHE_MAX_ENTRIES);
  const entries = Object.fromEntries(trimmed.map((page) => [normalizeUrl(page.url), page]));

  return {
    lastUrl: store.lastUrl,
    entries
  };
}

export async function loadPageCache(): Promise<PageCacheStore> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_STORAGE_KEY);
    if (!raw) {
      return EMPTY_STORE;
    }

    const parsed = JSON.parse(raw) as PageCacheStore;
    if (!parsed.entries || typeof parsed.entries !== 'object') {
      return EMPTY_STORE;
    }

    return trimEntries(pruneExpiredEntries(parsed));
  } catch {
    return EMPTY_STORE;
  }
}

export async function savePageCache(store: PageCacheStore): Promise<void> {
  const normalized = trimEntries(pruneExpiredEntries(store));
  await AsyncStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(normalized));
}

export function getCachedPage(store: PageCacheStore, url: string): CachedPage | null {
  const normalized = normalizeUrl(url);
  const page = store.entries[normalized];
  if (!page) {
    return null;
  }

  if (Date.now() - page.cachedAt > CACHE_TTL_MS) {
    return null;
  }

  return page;
}

export function upsertCachedPage(store: PageCacheStore, page: CachedPage): PageCacheStore {
  const normalized = normalizeUrl(page.url);
  const nextStore: PageCacheStore = {
    lastUrl: normalized,
    entries: {
      ...store.entries,
      [normalized]: {
        ...page,
        url: normalized,
        cachedAt: page.cachedAt
      }
    }
  };

  return trimEntries(pruneExpiredEntries(nextStore));
}