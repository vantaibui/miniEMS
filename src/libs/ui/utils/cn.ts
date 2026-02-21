import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Portable class name merger utility for UI components.
 * Independent of global app utils for Micro-FE readiness.
 */
export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}
