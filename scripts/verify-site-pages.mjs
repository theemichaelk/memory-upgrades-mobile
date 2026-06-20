const BASE_URL = 'https://www.memoryupgrades.org';

const SITE_PAGES = [
  { label: 'Home', path: '/' },
  { label: 'Blog', path: '/blog/' },
  { label: 'Memory Boosting Tips', path: '/blog/memory-boosting-tips/' },
  { label: 'Memory Techniques', path: '/blog/memory-techniques/' },
  { label: 'Cognitive Exercises', path: '/blog/cognitive-exercises/' },
  { label: 'Brain Training Exercises', path: '/blog/brain-training-exercises/' },
  { label: 'Memory Enhancement Techniques', path: '/blog/memory-enhancement-techniques/' },
  { label: 'Memory Improvement Strategies', path: '/blog/memory-improvement-strategies/' },
  { label: 'Memory Improvement Programs', path: '/blog/memory-improvement-programs/' },
  { label: 'How to Enhance Memory', path: '/blog/how-to-enhance-memory/' },
  { label: 'Proven Methods to Enhance Memory', path: '/blog/proven-methods-to-enhance-memory/' },
  { label: 'Techniques for Better Memory', path: '/blog/techniques-for-better-memory/' },
  { label: 'Improve Memory Retention', path: '/blog/improve-memory-retention/' },
  { label: 'Tips for Short-Term Memory', path: '/blog/tips-for-improving-short-term-memory/' },
  { label: 'Memory Techniques for Students', path: '/blog/memory-upgrade-techniques-for-students/' },
  { label: 'Best Exercises for Memory', path: '/blog/best-exercises-for-memory-improvement/' },
  { label: 'Memory Games and Activities', path: '/blog/memory-games-and-activities/' },
  { label: 'Mindfulness and Memory', path: '/blog/mindfulness-and-memory-improvement/' },
  { label: 'Natural Ways to Boost Memory', path: '/blog/natural-ways-to-boost-memory-power/' },
  { label: 'Nutrition for Brain Health', path: '/blog/nutrition-for-brain-health/' },
  { label: 'Nutrition for Better Memory', path: '/blog/nutrition-for-better-memory/' },
  { label: 'Age-Related Memory Loss', path: '/blog/age-related-memory-loss-solutions/' },
  { label: 'Research & Studies', path: '/blog/research-studies/' },
  { label: 'Resources & Tools', path: '/blog/resources-tools/' }
];

function pageUrl(path) {
  return path === '/' ? BASE_URL : `${BASE_URL}${path}`;
}

async function checkPage(page) {
  const url = pageUrl(page.path);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      redirect: 'follow'
    });
    clearTimeout(timeout);
    return { page, url, status: response.status, ok: response.ok };
  } catch (error) {
    clearTimeout(timeout);
    return { page, url, status: 0, ok: false, error: error.message };
  }
}

const results = await Promise.all(SITE_PAGES.map(checkPage));
const failures = results.filter((result) => !result.ok);

for (const result of results) {
  const statusLabel = result.ok ? result.status : `FAIL (${result.error ?? result.status})`;
  console.log(`${statusLabel.toString().padEnd(8)} ${result.page.label}`);
}

console.log(`\nChecked ${results.length} pages. ${results.length - failures.length} passed, ${failures.length} failed.`);

if (failures.length > 0) {
  process.exitCode = 1;
}