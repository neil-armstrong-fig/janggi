import {LegalPage} from "@src/react/pages/legal/LegalPage";

export function PrivacyPolicy(): React.JSX.Element {
  return (
    <LegalPage
      kind="privacy"
      title="Privacy Policy"
      summary="Janggi works without an account. If you choose Google sign-in, this policy explains the small amount of information used to keep your progress in step between devices."
    >
      <section className="space-y-3">
        <h2>What Janggi collects</h2>

        <p>
          You can play without signing in. In that case your current game, progress, bot record, preferences, onboarding
          state and custom styles stay in your browser. Janggi does not send them to the account service.
        </p>

        <p>
          If you choose Google sign-in, Janggi asks Google only for the <code>openid</code> scope. Google supplies a
          stable Google account identifier so the same account can be recognised later. Janggi never receives your
          Google email address, real name, profile or contacts.
        </p>

        <p>
          The account service keeps that identifier, an internal account identifier, when the account was created, a
          generated or user-chosen display name, hashed session records and the data you choose to sync: XP and unlocks,
          bot ratings and game history, preferences, custom board and piece styles, and markers for styles you deleted.
          A game still in progress is not synced.
        </p>

        <p>
          Cloudflare also processes connection information such as your IP address to deliver requests, limit sign-in
          attempts and writes, protect the service from abuse and produce operational logs when something fails.
        </p>
      </section>

      <section className="space-y-3">
        <h2>How Janggi uses information</h2>

        <p>
          Account information is used only to sign you in, show your chosen display name, merge your saved data and keep
          it in step across your devices. It is not used for advertising, marketing, profiling or automated decisions
          with legal or similarly significant effects, and it is never sold.
        </p>

        <p>
          The lawful basis for account and sync processing is performing the service you ask for when you sign in.
          Security, rate limiting and fault diagnosis rely on the legitimate interests of operating a safe and reliable
          service. Information may also be processed where necessary to meet a legal obligation.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Cookies and local storage</h2>

        <p>
          Janggi uses local storage so the game can reopen where you left it and work offline. It also caches the
          application files through a service worker. These are functional parts of the game, not advertising or
          analytics tools.
        </p>

        <p>
          Starting Google sign-in creates a secure, HTTP-only attempt cookie lasting up to ten minutes. A successful
          sign-in creates a secure, HTTP-only session cookie lasting up to thirty days. Both use{" "}
          <code>SameSite=Lax</code>. There are no advertising, analytics or marketing cookies.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Who handles information</h2>

        <p>
          Neil Armstrong is the data controller. Google handles the sign-in screen and confirms the stable account
          identifier. Cloudflare hosts the account API, database, security controls and operational logs. GitHub Pages
          serves the public game files. These providers process information under their own terms and privacy notices.
        </p>

        <p>
          Those providers operate internationally and may process information outside the United Kingdom using the legal
          safeguards applicable to their services. Information is not shared with other organisations except where
          required to run Janggi, protect it from abuse, or comply with law.
        </p>
      </section>

      <section className="space-y-3">
        <h2>How long information is kept</h2>

        <p>
          Browser data remains on your device until you clear it. Account and synced data remain until you choose
          <strong> Delete my account</strong> in Settings or ask for deletion. That action deletes the live account,
          synced data and its sessions; it does not erase the copies already held on your own devices.
        </p>

        <p>
          The sign-in attempt cookie expires after ten minutes and the browser session cookie after thirty days. Expired
          hashed session records can remain with the account until it is deleted, but cannot be used to sign in.
          Infrastructure logs and backups may remain for the limited periods set by the hosting providers.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Your choices and rights</h2>

        <p>
          Sign-in is optional. You can change your display name, sign out without deleting local progress, or delete the
          server account from Settings. You may also ask to access, correct, erase, restrict or receive your personal
          information, and object where processing relies on legitimate interests. These rights can vary where an
          exemption applies.
        </p>

        <p>
          Contact <a href="mailto:janggi@neilarmstrong.dev">janggi@neilarmstrong.dev</a> to exercise a right. You may
          also complain to the Information Commissioner’s Office through its official website at{" "}
          <a href="https://ico.org.uk/make-a-complaint/">ico.org.uk</a>.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Children</h2>

        <p>
          Janggi is a general-audience board game and does not ask for a date of birth. If you are not legally able to
          make these choices yourself, a parent or guardian should decide whether you use Google sign-in. A parent or
          guardian can contact Janggi about an account in their care.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Changes to this policy</h2>

        <p>
          This page will be updated before Janggi materially changes the Google data it requests, the information it
          stores, why it uses it, or who handles it. The effective date above shows when this version began to apply.
        </p>
      </section>

      <section className="space-y-3">
        <h2>Contact</h2>

        <p>
          Janggi is operated by Neil Armstrong in Northern Ireland. Privacy questions and requests can be sent to{" "}
          <a href="mailto:janggi@neilarmstrong.dev">janggi@neilarmstrong.dev</a>.
        </p>
      </section>
    </LegalPage>
  );
}
