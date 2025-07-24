// Main classes
export { Healer, TypedHealer } from './healer.js';

// Built-in libraries for easy configuration
export { sanitizers } from './sanitizers.js';
export { separators } from './separators.js';

// Types for TypeScript users
export type {
	HealerConfig,
	TypedHealerConfig,
	SanitizerFn,
	SeparatorFn,
	ReplacementConfig
} from './types.js';

// Advanced customization (for users who need to build custom sanitizers/separators)
export { createSeparator } from './separators.js';
