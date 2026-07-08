import { HyphenIdentifierHandler, KebabSlugSanitizer, NamedComparator } from './defaults.js';
import type {
  CanonicalRedirect,
  CollectHealResources,
  HealLayer,
  LayerConfig,
  LayerFactory,
  Selfhealer,
  SelfhealerConfig,
  SelfhealerOptions,
  StackEntry,
  StackResult,
  UrlCreator,
  UrlIdParser,
  UrlValidator
} from './types/index.js';

const appendSearchParams = (route: string, params?: URLSearchParams): string => {
  if (params && params.size > 0) return `${route}?${params.toString()}`;
  return route;
};

/**
 * Creates a configured self-healing URL helper.
 *
 * @example
 * ```ts
 * const healer = selfheal();
 *
 * // In a SvelteKit load, after your own (async) lookup:
 * const id = healer.parseId(params.id);
 * const article = await db.getArticle(id);
 * if (!article) error(404);
 *
 * const healArticle = healer.layer({
 *   fetch: getArticle,
 *   segment: (article) => ({ identifier: article.id, slug: article.title })
 * });
 *
 * const result = await healer.run(healArticle(params.id), url.searchParams);
 * if (result.notFound) error(404);
 * if (result.redirect) redirect(301, result.redirect);
 * ```
 */
export const selfheal = (params?: SelfhealerOptions): Selfhealer => {
  const healer: SelfhealerConfig = {
    sanitize: params?.sanitize ?? KebabSlugSanitizer,
    isEqual: params?.isEqual ?? NamedComparator,
    identifier: params?.identifier ?? HyphenIdentifierHandler
  };

  const createUrl: UrlCreator = (identifier, slug, searchParams) => {
    const route = healer.identifier.join(healer.sanitize(slug), identifier);
    return appendSearchParams(route, searchParams);
  };

  const parseId: UrlIdParser = (slug) => {
    return healer.identifier.separate(slug).identifier;
  };

  const validate: UrlValidator = (expectedUrl, actualRoute, searchParams) => {
    return healer.isEqual(expectedUrl, appendSearchParams(actualRoute, searchParams));
  };

  const canonicalRedirect: CanonicalRedirect = (segments, searchParams) => {
    const resolved = segments.map((segment) => {
      if (typeof segment === 'string') return { canonical: segment, healed: false };

      const canonical = createUrl(segment.identifier, segment.slug);
      return { canonical, healed: !healer.isEqual(canonical, segment.param) };
    });

    if (!resolved.some((segment) => segment.healed)) return null;

    const path = resolved.map((segment) => segment.canonical).join('/');
    return appendSearchParams(`/${path}`, searchParams);
  };

  const layer: LayerFactory = <T>(config: LayerConfig<T>) => {
    return (param) => ({
      param,
      resolve: async () => {
        const id = parseId(param);
        const resource = await config.fetch(id);
        if (resource == null) return null;

        const { identifier, slug } = config.segment(resource);
        return { param, identifier, slug, data: resource };
      }
    });
  };

  const stack = async <const T extends readonly StackEntry[]>(
    layers: T,
    searchParams?: URLSearchParams
  ): Promise<StackResult<CollectHealResources<T>>> => {
    const resolved: { canonical: string; healed: boolean }[] = [];
    const resources: unknown[] = [];

    for (const entry of layers) {
      if (typeof entry === 'string') {
        resolved.push({ canonical: entry, healed: false });
        continue;
      }

      const segment = await entry.resolve();
      if (!segment) return { notFound: true };

      const canonical = createUrl(segment.identifier, segment.slug);
      resolved.push({ canonical, healed: !healer.isEqual(canonical, entry.param) });
      resources.push(segment.data);
    }

    const redirect = resolved.some((segment) => segment.healed)
      ? appendSearchParams(
          `/${resolved.map((segment) => segment.canonical).join('/')}`,
          searchParams
        )
      : null;

    return {
      notFound: false,
      redirect,
      resources: resources as unknown as CollectHealResources<T>
    };
  };

  const run = async <T>(
    layer: HealLayer<T>,
    searchParams?: URLSearchParams
  ): Promise<StackResult<readonly [T]>> => stack([layer], searchParams);

  return {
    parseId,
    createUrl,
    validate,
    layer,
    run,
    stack,
    canonicalRedirect
  };
};
