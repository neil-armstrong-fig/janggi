/** The developer's own site, opened without taking the game away. */
export function DeveloperWebsiteLink(): React.JSX.Element {
  return (
    <a
      data-testid="developer-website-open"
      href="https://neilarmstrong.dev"
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-11 items-center justify-between gap-4 rounded-lg border border-wood/20 px-3 py-2 text-sm text-wood hover:bg-wood/10"
    >
      <span>Developer's website</span>

      <span className="text-xs text-wood/70">neilarmstrong.dev</span>
    </a>
  );
}
