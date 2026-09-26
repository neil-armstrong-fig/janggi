import {Board} from "@src/react/pages/game/components/board/Board";
import {Onboarding} from "@src/react/pages/game/components/onboarding/Onboarding";
import {RecordSheet} from "@src/react/pages/game/components/record-sheet/RecordSheet";
import {Settings} from "@src/react/pages/game/components/settings/Settings";
import {createFairyStockfish} from "@src/bot/engine/CreateFairyStockfish";
import {Status} from "@src/react/pages/game/components/status/Status";
import {StylesSheet} from "@src/react/pages/game/components/styles-sheet/StylesSheet";
import {useAppSelector} from "@src/redux/Hooks";
import {useBotEngine} from "@src/react/pages/game/hooks/use-bot-engine/UseBotEngine";
import {useBotOpponent} from "@src/react/pages/game/hooks/use-bot-opponent/UseBotOpponent";
import {useGameAudio} from "@src/react/pages/game/hooks/use-game-audio/UseGameAudio";
import {useGameMoment} from "@src/react/pages/game/hooks/use-game-moment/UseGameMoment";
import {useHaptics} from "@src/react/pages/game/hooks/use-haptics/UseHaptics";
import {usePreferences} from "@src/react/pages/game/hooks/use-preferences/UsePreferences";
import {useRatedGame} from "@src/react/pages/game/hooks/use-rated-game/UseRatedGame";
import {useState} from "react";

/**
 * The screen a game is played on, in the four sections the acceptance-test DSL already names:
 * `Status` says what the game is doing, `Board` is what is standing on it, `Settings` is everything a
 * player may choose, and `RecordSheet` is how they have fared against the bot.
 *
 * `Status` **frames** the board rather than sitting above it. Each army's plaque belongs on its own
 * side of the board — Han's across the top, where its pieces stand, and Cho's along the bottom — so
 * the section that draws the plaques is handed the board to put between them. The board keeps every
 * pixel the frame does not need.
 *
 * `Settings` is a sheet that slides up over the lower part of the screen when it is asked for, and
 * is out of the way otherwise. Which sheet is up, and which tab the settings sheet is turned to, are in
 * the store's `settings` slice rather than here: the control that opens it lives in the status row, the
 * sheets close and replace one another, and the tour opens and turns them, so no one section owns it.
 * It is not kept on the device — a page opens with no sheet up.
 *
 * `RecordSheet` slides up the same way, opened from inside `Settings`, which it replaces on screen.
 * **It is a sheet over the game rather than a page of its own** so the game underneath carries on: the
 * music keeps playing, a bot still thinking keeps thinking, and closing it puts the player back exactly
 * where they were.
 *
 * The most recent change to the game is worked out here too, by `useGameMoment`, because the board
 * shows it moving while the sound and the buzz answer the same change. Asked once and handed down,
 * none of them can disagree about what just happened. The sound and the buzz are played from here
 * for the same reason: they belong to no one section.
 *
 * Everything else comes from the store, and each section reads it for itself — the game, and the
 * player's preferences through `usePreferences`.
 *
 * The bot plays from here, and the rating is kept from here, because both answer the game as a whole
 * rather than any one section of it. The engine is made here once and costs nothing until the bot is the
 * opponent — it downloads nothing before then, and `useBotEngine` starts it the moment the bot is chosen.
 */
export function GamePage(): React.JSX.Element {
  const [engine] = useState(() => createFairyStockfish(`${import.meta.env.BASE_URL}engine/`));
  const played = useAppSelector(state => state.game.played);
  const {effects, soundEffectsVolume, musicVolume} = usePreferences();
  const moment = useGameMoment(played);

  const sound = useGameAudio({played, moment, soundEffectsVolume, musicVolume});
  useHaptics(played, moment, effects.full);
  useBotEngine(engine);
  useBotOpponent(engine);
  useRatedGame(moment);

  return (
    <main className="flex h-full w-full flex-col bg-ground p-2">
      <h1 className="sr-only">Janggi — Korean Chess</h1>

      <Status onControlPressed={() => sound("controlPressed")}>
        <Board moment={moment} onPickUp={() => sound("pieceLifted")} />
      </Status>

      <Settings />

      <RecordSheet />

      <StylesSheet />

      <Onboarding />
    </main>
  );
}
