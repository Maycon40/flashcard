import rehypeExternalLinks from "rehype-external-links";

/**
 * @param {Object} [params]
 * @param {(url?: string) => boolean} [params.shouldAddNofollow] - Returns `true` to add `nofollow`. Defaults to always `true`.
 * @param {import('rehype-external-links').Options} [params.options] - Options passed to `rehype-external-links`.
 * @returns {import('bytemd').BytemdPlugin}
 */

export function externalLinksPlugin({ options = {} } = {}) {
  function createRel(element: any) {
    const rel: string[] = [];
    const url = element.properties?.href;
    if (!url) return rel;

    rel.push("nofollow");

    if (element.properties.target === "_blank") {
      rel.push("noopener");
    }

    return rel;
  }

  return {
    rehype: (processor: any) =>
      processor.use(() => rehypeExternalLinks({ rel: createRel, ...options })),
  };
}
