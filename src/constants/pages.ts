import { BASE_URL } from '../constants';

export type SitePageGroup = 'main' | 'category';

export type SitePage = {
  id: string;
  label: string;
  path: string;
  group: SitePageGroup;
};

export const SITE_PAGES: SitePage[] = [
  { id: 'home', label: 'Home', path: '/', group: 'main' },
  { id: 'blog', label: 'Blog', path: '/blog/', group: 'main' },
  { id: 'blog-page-2', label: 'Blog — Page 2', path: '/blog/2', group: 'main' },
  { id: 'blog-page-3', label: 'Blog — Page 3', path: '/blog/3', group: 'main' },
  { id: 'blog-page-4', label: 'Blog — Page 4', path: '/blog/4', group: 'main' },
  { id: 'blog-page-5', label: 'Blog — Page 5', path: '/blog/5', group: 'main' },
  { id: 'blog-page-6', label: 'Blog — Page 6', path: '/blog/6', group: 'main' },
  { id: 'blog-page-7', label: 'Blog — Page 7', path: '/blog/7', group: 'main' },
  { id: 'blog-page-8', label: 'Blog — Page 8', path: '/blog/8', group: 'main' },
  { id: 'blog-page-9', label: 'Blog — Page 9', path: '/blog/9', group: 'main' },
  { id: 'memory-boosting-tips', label: 'Memory Boosting Tips', path: '/blog/memory-boosting-tips/', group: 'category' },
  { id: 'memory-techniques', label: 'Memory Techniques', path: '/blog/memory-techniques/', group: 'category' },
  { id: 'cognitive-exercises', label: 'Cognitive Exercises', path: '/blog/cognitive-exercises/', group: 'category' },
  { id: 'brain-training-exercises', label: 'Brain Training Exercises', path: '/blog/brain-training-exercises/', group: 'category' },
  { id: 'memory-enhancement-techniques', label: 'Memory Enhancement Techniques', path: '/blog/memory-enhancement-techniques/', group: 'category' },
  { id: 'memory-improvement-strategies', label: 'Memory Improvement Strategies', path: '/blog/memory-improvement-strategies/', group: 'category' },
  { id: 'memory-improvement-programs', label: 'Memory Improvement Programs', path: '/blog/memory-improvement-programs/', group: 'category' },
  { id: 'how-to-enhance-memory', label: 'How to Enhance Memory', path: '/blog/how-to-enhance-memory/', group: 'category' },
  { id: 'proven-methods-to-enhance-memory', label: 'Proven Methods to Enhance Memory', path: '/blog/proven-methods-to-enhance-memory/', group: 'category' },
  { id: 'techniques-for-better-memory', label: 'Techniques for Better Memory', path: '/blog/techniques-for-better-memory/', group: 'category' },
  { id: 'improve-memory-retention', label: 'Improve Memory Retention', path: '/blog/improve-memory-retention/', group: 'category' },
  { id: 'tips-for-improving-short-term-memory', label: 'Tips for Short-Term Memory', path: '/blog/tips-for-improving-short-term-memory/', group: 'category' },
  { id: 'memory-upgrade-techniques-for-students', label: 'Memory Techniques for Students', path: '/blog/memory-upgrade-techniques-for-students/', group: 'category' },
  { id: 'best-exercises-for-memory-improvement', label: 'Best Exercises for Memory', path: '/blog/best-exercises-for-memory-improvement/', group: 'category' },
  { id: 'memory-games-and-activities', label: 'Memory Games and Activities', path: '/blog/memory-games-and-activities/', group: 'category' },
  { id: 'mindfulness-and-memory-improvement', label: 'Mindfulness and Memory', path: '/blog/mindfulness-and-memory-improvement/', group: 'category' },
  { id: 'natural-ways-to-boost-memory-power', label: 'Natural Ways to Boost Memory', path: '/blog/natural-ways-to-boost-memory-power/', group: 'category' },
  { id: 'nutrition-for-brain-health', label: 'Nutrition for Brain Health', path: '/blog/nutrition-for-brain-health/', group: 'category' },
  { id: 'nutrition-for-better-memory', label: 'Nutrition for Better Memory', path: '/blog/nutrition-for-better-memory/', group: 'category' },
  { id: 'age-related-memory-loss-solutions', label: 'Age-Related Memory Loss', path: '/blog/age-related-memory-loss-solutions/', group: 'category' },
  { id: 'research-studies', label: 'Research & Studies', path: '/blog/research-studies/', group: 'category' },
  { id: 'resources-tools', label: 'Resources & Tools', path: '/blog/resources-tools/', group: 'category' }
];

export function getPageUrl(page: SitePage): string {
  if (page.path === '/') {
    return BASE_URL;
  }
  return `${BASE_URL}${page.path}`;
}

export function findPageByUrl(url: string): SitePage | undefined {
  const normalized = url.replace(/\/$/, '');
  return SITE_PAGES.find((page) => getPageUrl(page).replace(/\/$/, '') === normalized);
}