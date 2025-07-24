import type { SanitizerFn } from './types.js';
import { normalizeUnicode, condenseHyphens } from './utils.js';

/**
 * Unicode sanitizer (default) - handles international characters properly
 * Normalizes unicode, removes diacritics, keeps alphanumeric + hyphens
 * @example "Café & Résumé 123!" → "cafe-resume-123"
 */
export const unicode: SanitizerFn = (input: string): string => {
	return condenseHyphens(
		normalizeUnicode(input)
			.trim()
			.replace(/[^\w\s-]/g, '') // Remove special characters
			.replace(/\s+/g, '-') // Spaces to hyphens
			.toLowerCase()
	);
};

/**
 * Simple sanitizer - basic cleaning, keeps more characters
 * Replaces common symbols with words, less aggressive cleaning
 * @example "Café & Résumé 123!" → "cafe-and-resume-123"
 */
export const simple: SanitizerFn = (input: string): string => {
	return condenseHyphens(
		normalizeUnicode(input)
			.trim()
			.replace(/&/g, ' and ') // Replace & with " and "
			.replace(/@/g, ' at ') // Replace @ with " at "
			.replace(/\+/g, ' plus ') // Replace + with " plus "
			.replace(/[^\w\s-]/g, '') // Remove remaining special characters
			.replace(/\s+/g, '-') // Spaces to hyphens
			.toLowerCase()
	);
};

/**
 * Preserve sanitizer - minimal cleaning, preserves most characters
 * Only replaces spaces and removes truly problematic characters
 * @example "Café & Résumé 123!" → "café-résumé-123"
 */
export const preserve: SanitizerFn = (input: string): string => {
	return condenseHyphens(
		input
			.trim()
			.replace(/[<>:"\\|?*]/g, '') // Remove filesystem-unsafe characters
			.replace(/\s+/g, '-') // Spaces to hyphens
			.toLowerCase()
	);
};

/**
 * Business sanitizer - removes common business suffixes and cleans text
 * Useful for company names and business-related content
 * @example "Tech Corp Inc. & Co!" → "tech-corp"
 */
export const business: SanitizerFn = (input: string): string => {
	return condenseHyphens(
		normalizeUnicode(input)
			.trim()
			.replace(/\b(Inc|LLC|Corp|Ltd|Co|Company|Corporation|Limited)\b\.?/gi, '') // Remove business suffixes
			.replace(/[&@]/g, ' and ') // Replace symbols with words
			.replace(/[^\w\s-]/g, '') // Remove special characters
			.replace(/\s+/g, '-') // Spaces to hyphens
			.toLowerCase()
	);
};

/**
 * Collection of built-in sanitizer functions
 * Export as named object for easy access and documentation
 */
export const sanitizers = {
	unicode,
	simple,
	preserve,
	business
} as const;
