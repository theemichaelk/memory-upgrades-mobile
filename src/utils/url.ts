import { ALLOWED_HOSTS, BASE_URL } from '../constants';
import { findPageByUrl } from '../constants/pages';

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

export function isBlockedNavigation(url: string): boolean {
  if (!url || url === 'about:blank') {
    return false;
  }

  if (url.startsWith('javascript:') || url.startsWith('blob:') || url.startsWith('data:')) {
    return true;
  }

  if (url === '#' || url.endsWith('#') || url.endsWith('#0')) {
    return true;
  }

  return false;
}

export function isExternalUrl(url: string): boolean {
  if (!url || url === 'about:blank') {
    return false;
  }

  if (url.startsWith('mailto:') || url.startsWith('tel:')) {
    return true;
  }

  if (isBlockedNavigation(url)) {
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
  return normalizeUrl(process.env.EXPO_PUBLIC_BASE_URL ?? BASE_URL);
}

export function getReadablePath(url: string): string {
  try {
    const parsed = new URL(url);
    const page = findPageByUrl(url);
    if (page) {
      return page.label;
    }
    const path = parsed.pathname === '/' ? 'Home' : parsed.pathname.replace(/\/+$/, '').split('/').pop() || 'Page';
    return path.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  } catch {
    return 'Page';
  }
}