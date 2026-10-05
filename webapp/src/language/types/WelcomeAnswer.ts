import type {EffectsName} from "@janggi/shared/janggi/settings/EffectsName";
import type {MovableHighlightName} from "@janggi/shared/janggi/settings/MovableHighlightName";
import type {SoundChoiceName} from "@janggi/shared/janggi/onboarding/SoundChoiceName";

/** Every button the welcome's choices offer, by the name it has in the code. */
export type WelcomeAnswer = SoundChoiceName | EffectsName | MovableHighlightName;
