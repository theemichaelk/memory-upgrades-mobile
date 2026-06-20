const BASE_URL = 'https://www.memoryupgrades.org';
const ALLOWED_HOSTS = ['www.memoryupgrades.org', 'memoryupgrades.org'];

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return url;
  }
}

function isAllowedHost(url) {
  try {
    return ALLOWED_HOSTS.includes(new URL(url).hostname.toLowerCase());
  } catch {
    return false;
  }
}

function isBlockedNavigation(url) {
  if (!url || url === 'about:blank') return false;
  if (url.startsWith('javascript:') || url.startsWith('blob:') || url.startsWith('data:')) return true;
  if (url === '#' || url.endsWith('#') || url.endsWith('#0')) return true;
  return false;
}

function isExternalUrl(url) {
  if (!url || url === 'about:blank') return false;
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return true;
  if (isBlockedNavigation(url)) return true;
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return true;
    return !isAllowedHost(url);
  } catch {
    return false;
  }
}

function resolveDeepLink(url) {
  if (!url) return null;
  if (url.startsWith('memoryupgrades://')) {
    const path = url.replace('memoryupgrades://', '').replace(/^\//, '');
    return normalizeUrl(path ? `${BASE_URL}/${path}` : BASE_URL);
  }
  if (isAllowedHost(url)) return normalizeUrl(url);
  return null;
}

const tests = [
  {
    name: 'normalizeUrl strips hash',
    run: () => normalizeUrl('https://www.memoryupgrades.org/blog/#section') === 'https://www.memoryupgrades.org/blog/'
  },
  {
    name: 'internal blog URL is not external',
    run: () => isExternalUrl('https://www.memoryupgrades.org/blog/memory-boosting-tips/') === false
  },
  {
    name: 'ezistack contact opens externally',
    run: () => isExternalUrl('https://ezistack.com/ezistack/Builder/ai_templates/Flex/#contact') === true
  },
  {
    name: 'hash-only links are blocked',
    run: () => isBlockedNavigation('https://www.memoryupgrades.org/blog/#0') === true
  },
  {
    name: 'javascript links are blocked',
    run: () => isBlockedNavigation('javascript:void(0)') === true
  },
  {
    name: 'deep link resolves to blog path',
    run: () =>
      resolveDeepLink('memoryupgrades://blog/memory-boosting-tips/') ===
      'https://www.memoryupgrades.org/blog/memory-boosting-tips/'
  },
  {
    name: 'universal link resolves',
    run: () => resolveDeepLink('https://www.memoryupgrades.org/blog/') === 'https://www.memoryupgrades.org/blog/'
  },
  {
    name: 'unknown deep link host rejected',
    run: () => resolveDeepLink('https://example.com/page') === null
  }
];

let passed = 0;
let failed = 0;

for (const test of tests) {
  const ok = Boolean(test.run());
  console.log(`${ok ? 'PASS' : 'FAIL'} ${test.name}`);
  if (ok) passed += 1;
  else failed += 1;
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exitCode = 1;