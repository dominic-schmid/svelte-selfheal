import pkg from '../../package.json' with { type: 'json' };
import type { LayoutServerLoad } from './$types.js';

export const load = (() => ({
  version: pkg.version,
  siteOrigin: process.env['PUBLIC_SITE_URL'] ?? ''
})) satisfies LayoutServerLoad;
