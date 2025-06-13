export const CACHE_CONFIG = {
  DEFAULT_REVALIDATE: 604800, // 7 дней
  STALE_WHILE_REVALIDATE: 3600, // 1 час
  HOLIDAYS_REVALIDATE: 604800, // тоже 7 дней
  WORKING_DAYS_REVALIDATE: 604800, // тоже 7 дней
  BROWSER_MAX_AGE: 15552000, // браузерный кэш на 180 дней
};

export const CACHE_CONTROL = [
  'public',
  `max-age=${CACHE_CONFIG.BROWSER_MAX_AGE}`,
  `s-maxage=${CACHE_CONFIG.DEFAULT_REVALIDATE}`,
  `stale-while-revalidate=${CACHE_CONFIG.STALE_WHILE_REVALIDATE}`,
].join(', ');
