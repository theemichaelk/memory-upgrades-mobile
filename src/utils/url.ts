import { ALLOWED_HOSTS, BASE_URL } from '../constants';

export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return url;
  }
}

export function isAllowedHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return ALLOWED_HOSTS.includes(host as (typeof ALLOWED_HOSTS)[number]);
  } catch {
    return false;
  }
}

export function isExternalUrl(url: string): boolean {
  if (!url || url === 'about:blank') {
    return false;
  }

  if (url.startsWith('mailto:') || url.startsWith('tel:')) {
    return true;
  }

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return true;
    }
    return !isAllowedHost(url);
  } catch {
    return false;
  }
}

export function getHomeUrl(): string {
  return normalizeUrl(BASE_URL);
}