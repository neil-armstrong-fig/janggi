/** The app's source repository, opened without taking the game away. */
export function RepositoryLink(): React.JSX.Element {
  return (
    <a
      data-testid="repository-open"
      href="https://github.com/neil-armstrong-fig/janggi"
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-11 items-center justify-between gap-4 rounded-lg border border-wood/20 px-3 py-2 text-sm text-wood hover:bg-wood/10"
    >
      <span>Source code</span>

      <span className="text-xs text-wood/70">Github</span>
    </a>
  );
}
