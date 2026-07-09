import { building } from '$app/environment';

export const prerender = true;
/** Static output ships without a client bundle; dev keeps CSR on for HMR. */
export const csr = !building;
