import type {PieceSetName} from "@janggi/shared/janggi/settings/PieceSetName";

type SupportedPieceStyleName = "Traditional" | "Hangul" | "Modern";

export type GuidePieceStyleName = Extract<PieceSetName, SupportedPieceStyleName>;
