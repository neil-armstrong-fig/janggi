import {BOT_ELOS} from "@janggi/shared/janggi/settings/BotElo";
import type {BotStrengthOption} from "@src/react/pages/game/components/settings/types/BotStrengthOption";
import {OPPONENT_NAMES} from "@janggi/shared/janggi/settings/OpponentName";
import {SIDE_CHOICE_NAMES} from "@janggi/shared/janggi/settings/SideChoiceName";

/** Who the other army is played by. */
export const OPPONENT_OPTIONS = OPPONENT_NAMES.map(name => ({name}));

/** How strongly the bot plays, weakest first. */
export const BOT_STRENGTH_OPTIONS: readonly BotStrengthOption[] = BOT_ELOS.map(elo => ({name: String(elo), elo}));

/** Which army the player takes against the bot. */
export const SIDE_CHOICE_OPTIONS = SIDE_CHOICE_NAMES.map(name => ({name}));
