import { EMPTY_STRING } from '../constants/app';

export function setCookie<T>(
  name: string,
  value: T,
  days?: number,
  path: string = '/',
): void {
  try {
    let expires = EMPTY_STRING;
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }

    // Handle objects/arrays by stringifying
    const stringValue =
      typeof value === 'object' ? JSON.stringify(value) : String(value);

    document.cookie = `${name}=${encodeURIComponent(stringValue)}${expires}; path=${path}; SameSite=Lax`;
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
}

export function getCookie<T>(name: string): T | string | null {
  try {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);

      if (c.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
        try {
          return JSON.parse(value) as T;
        } catch {
          return value;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
}

export function removeCookie(name: string, path: string = '/'): void {
  try {
    document.cookie = `${name}=; Max-Age=-99999999; path=${path}`;
  } catch (error) {
    console.error('Error removing cookie:', error);
  }
}
