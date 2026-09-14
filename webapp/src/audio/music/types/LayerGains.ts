import type {LayerName} from "@src/audio/music/types/LayerName";

/** How loud each layer of the music should be, from nought (silent) to one (as loud as it is mixed). */
export type LayerGains = Record<LayerName, number>;
