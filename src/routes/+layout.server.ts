import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { LayoutServerLoad } from './$types.js';

const { version } = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8')) as {
  version: string;
};

export const load = (() => ({
  version,
  siteOrigin: process.env['PUBLIC_SITE_URL'] ?? ''
})) satisfies LayoutServerLoad;
