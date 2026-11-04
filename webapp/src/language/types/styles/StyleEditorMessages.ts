import type {SceneName} from "@janggi/shared/janggi/styles/SceneName";
import type {StyleView} from "@janggi/shared/janggi/styles/StyleView";

/** The editor's frame: the name, the preview's options and the two views of a style. */
export interface StyleEditorMessages {
  readonly back: string;
  readonly namePlaceholder: string;
  readonly save: string;
  readonly changing: string;
  readonly changeAllOf: string;
  readonly reset: string;
  readonly everyPoint: string;
  readonly point: (pointKey: string) => string;
  readonly viewsLabel: string;
  readonly views: Record<StyleView, string>;
  readonly rawLabel: string;
  readonly saved: (name: string) => string;
  readonly notABoard: string;
  readonly notAPieceSet: string;
  readonly previewOn: string;
  readonly currentBoard: string;
  readonly previewWith: string;
  readonly currentPieces: string;
  readonly scenesLabel: string;
  readonly scenes: Record<SceneName, string>;
}
