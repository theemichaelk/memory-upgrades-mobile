export type PageHtmlPayload = {
  url: string;
  html: string;
};

export type WebViewMessage =
  | { type: 'page-html'; payload: PageHtmlPayload }
  | { type: string; payload?: unknown };

export type CachedPage = {
  url: string;
  html: string;
  cachedAt: number;
};

export type PageCacheStore = {
  lastUrl: string;
  entries: Record<string, CachedPage>;
};