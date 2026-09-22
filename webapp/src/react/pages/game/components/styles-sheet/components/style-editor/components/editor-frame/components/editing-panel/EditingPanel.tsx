import {RawView} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/editor-frame/components/editing-panel/components/raw-view/RawView";
import type {StyleView} from "@src/react/pages/game/components/styles-sheet/components/style-editor/types/StyleView";
import {ViewToggle} from "@src/react/pages/game/components/styles-sheet/components/style-editor/components/editor-frame/components/editing-panel/components/view-toggle/ViewToggle";

/**
 * Everything that changes the style: the ways to start it over above, then the controls or the raw JSON,
 * as the player has chosen. Beside the preview on a desktop, beneath it on a phone.
 */
interface Props {
  /** Whatever starts the style over — loading another, resetting. */
  readonly tools: React.ReactNode;
  readonly controls: React.ReactNode;
  readonly styleView: StyleView;
  readonly onView: (styleView: StyleView) => void;
  readonly raw: string;
  readonly rawRefusal: string | undefined;
  readonly onRaw: (text: string) => void;
}

export function EditingPanel({tools, controls, styleView, onView, raw, rawRefusal, onRaw}: Props): React.JSX.Element {
  return (
    <>
      {tools}

      <ViewToggle styleView={styleView} onView={onView} />

      {styleView === "controls" && controls}

      {styleView === "raw" && <RawView raw={raw} rawRefusal={rawRefusal} onRaw={onRaw} />}
    </>
  );
}
