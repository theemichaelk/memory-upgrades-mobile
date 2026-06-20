import { BASE_URL } from '../constants';
import { isAllowedHost, normalizeUrl } from './url';

export function resolveDeepLink(url: string): string | null {
  if (!url) {
    return null;
  }

  if (url.startsWith('memoryupgrades://')) {
    const path = url.replace('memoryupgrades://', '').replace(/^\//, '');
    return normalizeUrl(path ? `${BASE_URL}/${path}` : BASE_URL);
  }

  if (isAllowedHost(url)) {
    return normalizeUrl(url);
  }

  return null;
}