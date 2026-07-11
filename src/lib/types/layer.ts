import type { HealSegment } from './segment.js';

/**
 * Config for a reusable heal layer — fetch a resource from a route param,
 * then map it to `{ identifier, slug }` for canonical URL building.
 */
export interface LayerConfig<T> {
  /** Load the resource by parsed identifier; return `null`/`undefined` when not found */
  fetch: (id: string) => Promise<T | null | undefined>;
  /** Map the loaded resource to its canonical segment fields */
  segment: (resource: T) => { identifier: string | number; slug: string };
}

/**
 * An instantiated heal layer bound to a route param. Pass to {@link Run} for a
 * single segment, or {@link Stack} to compose with static segments and other layers.
 */
export interface HealLayer<T = unknown> {
  param: string;
  resolve: () => Promise<(HealSegment & { data: T }) | null>;
}

/** One entry in a {@link Stack} — a static path literal or a {@link HealLayer}. */
export type StackEntry = string | HealLayer;

/**
 * Collects each heal layer's resource type from a stack tuple, in order.
 * Static string segments are skipped.
 */
export type CollectHealResources<T extends readonly StackEntry[]> = T extends readonly [
  infer Head,
  ...infer Tail extends readonly StackEntry[]
]
  ? Head extends HealLayer<infer U>
    ? readonly [U, ...CollectHealResources<Tail>]
    : CollectHealResources<Tail>
  : readonly [];

/** Any heal layer's fetch failed — treat as 404. */
export interface StackNotFound {
  notFound: true;
}

/** All layers resolved. Redirect when any segment was off-canonical. */
export interface StackOk<TResources extends readonly unknown[] = readonly []> {
  notFound: false;
  /** Absolute canonical path to redirect to, or `null` when already canonical */
  redirect: string | null;
  /** Resolved resources from heal layers only, in stack order (static segments omitted) */
  resources: TResources;
}

/** Discriminated result from {@link Stack} or {@link Run} — check `notFound` first, then `redirect`. */
export type StackResult<TResources extends readonly unknown[] = readonly []> =
  | StackNotFound
  | StackOk<TResources>;

/**
 * Run a single heal layer — sugar for `stack([layer])` on one-segment routes.
 * Returns `StackResult<[T]>` with the resource at `resources[0]`.
 */
export type Run = <T>(
  layer: HealLayer<T>,
  searchParams?: URLSearchParams
) => Promise<StackResult<readonly [T]>>;

/**
 * Async path composition: resolves each {@link HealLayer} in order (fetch + heal),
 * keeps static string segments verbatim, and returns the full canonical path when
 * any dynamic segment is off.
 */
export type Stack = <const T extends readonly StackEntry[]>(
  layers: T,
  searchParams?: URLSearchParams
) => Promise<StackResult<CollectHealResources<T>>>;

/**
 * Creates a reusable heal layer factory. Call the result with a route param to
 * get a {@link HealLayer} you can pass to {@link Run} or {@link Stack}.
 */
export type LayerFactory = <T>(config: LayerConfig<T>) => (param: string) => HealLayer<T>;
