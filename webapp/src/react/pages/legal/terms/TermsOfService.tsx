import {LegalPage} from "@src/react/pages/legal/LegalPage";

export function TermsOfService(): React.JSX.Element {
  return (
    <LegalPage
      kind="terms"
      title="Terms of Service"
      summary="These terms govern your use of Janggi, including its optional Google sign-in and progress-sync service."
    >
      <section className="space-y-3">
        <h2>Using Janggi</h2>

        <p>
          These terms are an agreement between you and Neil Armstrong, the independent operator of Janggi. By using
          Janggi you agree to them. If you are not legally able to agree for yourself, you may use Janggi only with a
          parent or guardian who accepts these terms for you.
        </p>

        <p>
          Janggi is a free board game that can be played locally without an account. Google sign-in is optional and is
          offered only to keep selected progress and preferences in step across devices.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Accounts and sync</h2>

        <p>
          You may connect one Google account through the sign-in flow. You are responsible for access to that Google
          account and for any display name you choose. Google’s own terms apply to its sign-in service.
        </p>

        <p>
          Sync is a convenience, not a backup guarantee. Keep any information you cannot afford to lose somewhere else.
          You can sign out while keeping local data, or choose <strong>Delete my account</strong> in Settings to remove
          the account and synced data from the live service. Copies on your devices remain yours to clear.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Acceptable use</h2>

        <p>You must not use Janggi to:</p>

        <ul className="list-disc space-y-2 pl-6">
          <li>break the law or infringe another person’s rights;</li>
          <li>upload a display name or style content that is unlawful, abusive or harmful;</li>
          <li>attempt to access another person’s account or data;</li>
          <li>probe, bypass or interfere with security, rate limits, the API or the service;</li>
          <li>use automation or excessive requests in a way that disrupts Janggi for others.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2>Your content</h2>

        <p>
          You keep any rights you have in display names and custom styles you create. You give Janggi a limited,
          worldwide permission to host, copy, process and transmit that content only as needed to provide sync, security
          and support. This permission ends when the content or account is deleted, subject to short-lived
          infrastructure backups and legal obligations.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Intellectual property</h2>

        <p>
          Janggi’s source code is made available under its stated open-source licence. Fairy-Stockfish and other
          third-party software remain under their own licences. These terms do not replace or restrict rights those
          licences give you. The project’s <a href="references.html">references and credits</a> identify the principal
          software and sources used.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Availability</h2>

        <p>
          Janggi may change, add or remove features, impose reasonable limits, suspend account functions, or stop
          operating. The local game is designed to work offline, but Google sign-in and sync depend on third-party
          services and network availability and may be interrupted.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Disclaimers and liability</h2>

        <p>
          Janggi is provided free of charge and, to the fullest extent permitted by law, without promises that it will
          always be available, uninterrupted, error-free or suitable for a particular purpose. You are responsible for
          deciding whether to rely on synced or locally stored data.
        </p>

        <p>
          Nothing in these terms excludes or limits liability where the law does not allow that, including liability for
          fraud, fraudulent misrepresentation, death or personal injury caused by negligence, or your mandatory consumer
          rights. Subject to that, the operator is not responsible for indirect or consequential loss arising from use
          of the free service.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Ending use</h2>

        <p>
          You may stop using Janggi at any time. The operator may restrict or end access to account services where
          reasonably necessary to protect Janggi, other users or third parties, or where these terms are materially
          breached. Account deletion remains available from Settings while the service is operating.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Changes to these terms</h2>

        <p>
          These terms may be updated when Janggi or the law changes. Material changes will be identified by a new
          effective date and, where reasonably possible, explained in the application before they take effect.
          Continuing to use Janggi after the effective date means the updated terms apply.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Governing law</h2>

        <p>
          These terms are governed by the law of Northern Ireland. If you are a consumer, this does not take away any
          mandatory protection given by the law where you live or any right the law gives you to bring proceedings in
          another available local court. Otherwise, the courts of Northern Ireland have jurisdiction.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Contact</h2>

        <p>
          Questions about these terms can be sent to{" "}
          <a href="mailto:janggi@neilarmstrong.dev">janggi@neilarmstrong.dev</a>.
        </p>
      </section>
    </LegalPage>
  );
}
