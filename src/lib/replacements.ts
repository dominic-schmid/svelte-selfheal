import type { ReplacementConfig } from './types.js';

/**
 * Applies character replacements to text - ONLY does replacements, no other processing
 * @param input - The text to process
 * @param config - What characters to replace
 * @returns Text with configured character replacements applied
 */
export function applyReplacements(input: string, config: ReplacementConfig = {}): string {
	let result = input;

	// Apply basic replacements (all enabled by default)
	if (config.replaceDots !== false) result = result.replace(/\./g, '-');
	if (config.replaceAmpersands !== false) result = result.replace(/&/g, ' and ');
	if (config.replaceAtSigns !== false) result = result.replace(/@/g, ' at ');
	if (config.replacePlus !== false) result = result.replace(/\+/g, ' plus ');
	if (config.replaceUnderscores !== false) result = result.replace(/_/g, '-');
	if (config.replaceSpaces !== false) result = result.replace(/\s+/g, '-');

	// Apply custom replacements
	if (config.customReplacements) {
		for (const [from, to] of Object.entries(config.customReplacements)) {
			result = result.replace(new RegExp(escapeRegex(from), 'g'), to);
		}
	}

	return result;
}

/**
 * Creates a sanitizer that applies replacements and then uses an existing sanitizer
 * @param replacementConfig - What characters to replace
 * @param baseSanitizer - The base sanitizer to apply after replacements
 * @returns A new sanitizer function
 */
export function createReplacementSanitizer(
	replacementConfig: ReplacementConfig,
	baseSanitizer: (input: string) => string
): (input: string) => string {
	return (input: string): string => {
		const replaced = applyReplacements(input, replacementConfig);
		return baseSanitizer(replaced);
	};
}

/**
 * Escapes regex special characters
 */
function escapeRegex(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
