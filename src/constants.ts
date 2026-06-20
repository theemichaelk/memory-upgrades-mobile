export const BASE_URL = 'https://www.memoryupgrades.org';
export const APP_HOME_URL = `${BASE_URL}/blog/`;
export const APP_ARTICLES_URL = `${BASE_URL}/blog/memory-boosting-tips/`;
export const ALLOWED_HOSTS = ['www.memoryupgrades.org', 'memoryupgrades.org'] as const;

export const CACHE_STORAGE_KEY = 'memory-upgrades:page-cache';
export const CACHE_MAX_ENTRIES = 25;
export const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

