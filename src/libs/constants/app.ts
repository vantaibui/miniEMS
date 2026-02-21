export const APP_PREFIX = 'sonicvista_';
export const APP_NAME = 'SonicVista';
export const EMPTY_STRING = '';

export const PAGE_TITLES = {
  HOME: 'Home',
  LOGIN: 'Login',
  NOT_FOUND: 'Page Not Found',
} as const;

export const getPageTitle = (title: string) => `${title} | ${APP_NAME}`;
