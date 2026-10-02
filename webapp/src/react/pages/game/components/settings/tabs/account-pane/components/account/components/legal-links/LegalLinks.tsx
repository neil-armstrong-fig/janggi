export function LegalLinks(): React.JSX.Element {
  return (
    <p className="text-xs leading-relaxed text-white/60">
      By signing in, you agree to the{" "}
      <a
        data-testid="terms-open"
        href={`${import.meta.env.BASE_URL}terms.html`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-white/30 underline-offset-2 hover:text-white/80"
      >
        Terms of Service
      </a>{" "}
      and acknowledge the{" "}
      <a
        data-testid="privacy-open"
        href={`${import.meta.env.BASE_URL}privacy.html`}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-white/30 underline-offset-2 hover:text-white/80"
      >
        Privacy Policy
      </a>
      .
    </p>
  );
}
