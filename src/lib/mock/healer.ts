import { Healer } from '$lib/index.js';

export const articleHealer = new Healer({ order: 'id-last' });

export const userHealer = new Healer({ separator: '~' });
