import {languageNoticeDismissed} from "@src/redux/preferences/PreferencesSlice";
import {messagesOf} from "@src/language/MessagesOf";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";

/**
 * Tells a player who is reading the game in Korean that the Korean is still being written, so one who comes
 * across it before it is ready is not left to wonder why half the page is English. Up while the language is
 * Korean and they have not read it; choosing Korean again puts it back (`languageChosen`), and English never shows it.
 *
 * **It says so in both languages at once**, whichever the page is in, since the player who most needs it may
 * not read the other. It sits at the top and dims nothing, so it never stands between the player and the
 * game — Dismiss, or simply playing on, is up to them — and above the welcome, which can open in Korean too.
 *
 * Temporary: delete it, with the `languageNoticeSeen` preference, when the translation is accepted
 * (`docs/localisation.md`).
 */
export function LanguageNotice(): React.JSX.Element | null {
  const language = useAppSelector(state => state.preferences.language);
  const seen = useAppSelector(state => state.preferences.languageNoticeSeen);
  const dispatch = useAppDispatch();
  if (language !== "ko" || seen) return null;

  const korean = messagesOf("ko").translationNotice;
  const english = messagesOf("en").translationNotice;

  return (
    <section
      data-testid="language-notice"
      role="dialog"
      aria-labelledby="language-notice-title"
      className="fixed inset-x-3 top-3 z-40 mx-auto flex max-w-md flex-col gap-2 rounded-2xl bg-ground-raised p-4 shadow-2xl ring-1 shadow-black ring-gold/40"
    >
      <h2 id="language-notice-title" lang="ko" className="text-base font-semibold text-wood">
        {korean.title}
      </h2>

      <p lang="ko" className="text-sm text-white/80">
        {korean.body}
      </p>

      <p lang="en" className="text-xs text-white/60">
        {english.body}
      </p>

      <button
        type="button"
        data-testid="language-notice-dismiss"
        onClick={() => dispatch(languageNoticeDismissed())}
        className="cursor-pointer self-end rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-ink"
      >
        {korean.dismiss} · {english.dismiss}
      </button>
    </section>
  );
}
