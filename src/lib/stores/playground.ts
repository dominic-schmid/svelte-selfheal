import { writable } from 'svelte/store';
import { Healer, sanitizers, separators } from '$lib/index.js';

export interface PlaygroundConfig {
	separatorType: keyof typeof separators | 'custom';
	customSeparator: string;
	order: 'id-first' | 'id-last';
	sanitizerType: keyof typeof sanitizers;
	idType: 'uuid' | 'random-int' | 'random-string';
	itemCount: number;
	stringLength: number;
}

export interface PlaygroundState {
	config: PlaygroundConfig;
	healer: Healer;
	configString: string;
	items: Array<{ id: string | number; title: string }>;
}

const defaultConfig: PlaygroundConfig = {
	separatorType: 'underscore',
	customSeparator: '-',
	order: 'id-first',
	sanitizerType: 'unicode',
	idType: 'uuid',
	itemCount: 5,
	stringLength: 8
};

function createHealer(config: PlaygroundConfig): Healer {
	return new Healer({
		separator:
			config.separatorType === 'custom' ? config.customSeparator : separators[config.separatorType],
		order: config.order,
		sanitizer: sanitizers[config.sanitizerType]
	});
}

function createConfigString(config: PlaygroundConfig): string {
	const sepValue =
		config.separatorType === 'custom' ? config.customSeparator : config.separatorType;
	return `new Healer({ separator: '${sepValue}', order: '${config.order}', sanitizer: sanitizers.${config.sanitizerType} })`;
}

function createPlaygroundStore() {
	const initialState: PlaygroundState = {
		config: defaultConfig,
		healer: createHealer(defaultConfig),
		configString: createConfigString(defaultConfig),
		items: []
	};

	const { subscribe, update } = writable(initialState);

	return {
		subscribe,
		updateConfig: (newConfig: Partial<PlaygroundConfig>) => {
			update((state) => {
				const config = { ...state.config, ...newConfig };
				return {
					...state,
					config,
					healer: createHealer(config),
					configString: createConfigString(config)
				};
			});
		},
		setItems: (items: Array<{ id: string | number; title: string }>) => {
			update((state) => ({ ...state, items }));
		}
	};
}

export const playgroundStore = createPlaygroundStore();
