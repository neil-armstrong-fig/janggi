/** Which build this is, small and last in the tab, so an installed copy can be told from a fresh one. */
export function AppVersion(): React.JSX.Element {
  return (
    <p className="text-center text-xs text-white/40">
      Version <span data-testid="app-version">{import.meta.env.VITE_BUILD_ID ?? "dev"}</span>
    </p>
  );
}
