// ========================================
// PRIMARY API - Use these 90% of the time
// ========================================

// Main classes with improved DX
export { Healer, TypedHealer } from './healer.js';

// ========================================
// BUILT-IN CONFIGURATIONS
// ========================================

// Built-in libraries for easy configuration
export { sanitizers } from './sanitizers.js';
export { separators } from './separators.js';

// ========================================
// TYPESCRIPT SUPPORT
// ========================================

// Types for TypeScript users
export type {
	HealerConfig,
	TypedHealerConfig,
	SanitizerFn,
	SeparatorFn,
	ReplacementConfig
} from './types.js';

// ========================================
// ADVANCED CUSTOMIZATION
// ========================================

// For users who need to build custom sanitizers/separators
export { createSeparator, createLengthPrefixedSeparator } from './separators.js';
