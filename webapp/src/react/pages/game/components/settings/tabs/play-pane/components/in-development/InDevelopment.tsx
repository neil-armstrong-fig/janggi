const FEATURES = ["Clocks", "Matchmaking", "Variants"] as const;

/**
 * What is being built and is not yet in production, where each will get its way in. Only a build with `UNRELEASED`
 * draws it, so its words stay here in English rather than in `src/language/` until they are released.
 */
export function InDevelopment(): React.JSX.Element {
  return (
    <section data-testid="unreleased-in-development" className="flex flex-col gap-2">
      <h3 className="text-xs text-white/50">In development</h3>

      <ul className="flex flex-col gap-1 text-sm">
        {FEATURES.map(feature => (
          <li key={feature} data-testid="unreleased-feature">
            {feature}
          </li>
        ))}
      </ul>
    </section>
  );
}
