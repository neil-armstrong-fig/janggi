import {datedSitemap} from "./DatedSitemap.js";

const SITEMAP = `<urlset>
  <url>
    <loc>https://janggi.neilarmstrong.dev/</loc>
    <xhtml:link rel="alternate" hreflang="ko" href="https://janggi.neilarmstrong.dev/ko/"/>
  </url>
  <url>
    <loc>https://janggi.neilarmstrong.dev/learn.html</loc>
  </url>
</urlset>`;

const DATES: Readonly<Record<string, string>> = {
  "https://janggi.neilarmstrong.dev/": "2026-10-05",
  "https://janggi.neilarmstrong.dev/learn.html": "2026-09-01",
};

it("dates each address with what is known of that address", () => {
  const dated = datedSitemap(SITEMAP, address => DATES[address] ?? "");

  expect(dated).toContain("<loc>https://janggi.neilarmstrong.dev/</loc>\n    <lastmod>2026-10-05</lastmod>");
  expect(dated).toContain("<loc>https://janggi.neilarmstrong.dev/learn.html</loc>\n    <lastmod>2026-09-01</lastmod>");
});

it("asks for each address once, and never for the address of an alternate", () => {
  const asked: string[] = [];

  datedSitemap(SITEMAP, address => {
    asked.push(address);

    return "2026-10-05";
  });

  expect(asked).toEqual(["https://janggi.neilarmstrong.dev/", "https://janggi.neilarmstrong.dev/learn.html"]);
});

it("leaves everything else in the sitemap as it was", () => {
  const dated = datedSitemap(SITEMAP, () => "2026-10-05");

  expect(dated.replaceAll(/\n\s*<lastmod>[^<]*<\/lastmod>/g, "")).toBe(SITEMAP);
});
