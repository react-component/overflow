export const isClient =
  typeof window !== 'undefined' &&
  window.document &&
  window.document.documentElement;

/** Is client side and not jsdom */
export const isBrowserClient = process.env.NODE_ENV !== 'test' && isClient;
