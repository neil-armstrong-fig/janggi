/**
 * Puts a `<lastmod>` straight after each `<loc>` in the sitemap, the date `dateOf` gives for that address.
 *
 * A crawler that is told when a page last changed can skip the ones that have not, and revisit the ones that
 * have — but only trusts the date while it keeps being true, so `dateOf` must answer with when the page really
 * changed and not with when it was built.
 */
export function datedSitemap(sitemap: string, dateOf: (address: string) => string): string {
  return sitemap.replace(/<loc>([^<]*)<\/loc>/g, (entry: string, address: string): string => {
    return `${entry}\n    <lastmod>${dateOf(address)}</lastmod>`;
  });
}
