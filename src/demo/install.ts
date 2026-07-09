export interface PackageManager {
  id: string;
  label: string;
  command: string;
}

export const packageManagers: PackageManager[] = [
  { id: 'pnpm', label: 'pnpm', command: 'pnpm add svelte-selfheal' },
  { id: 'npm', label: 'npm', command: 'npm install svelte-selfheal' },
  { id: 'yarn', label: 'yarn', command: 'yarn add svelte-selfheal' },
  { id: 'bun', label: 'bun', command: 'bun add svelte-selfheal' }
];
