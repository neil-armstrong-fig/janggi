import {ExplanationToggle} from "@src/react/pages/game/components/settings/components/explanation-toggle/ExplanationToggle";
import {Switch} from "@src/react/pages/game/components/settings/components/switch/Switch";
import {useId, useState} from "react";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

/**
 * A switch that can say what it does: a (?) beside its label, unfolding the words under it, so a busy tab is one line a
 * setting until someone asks. As with `OptionPicker`, the (?) is never disabled with the switch: a locked setting is still
 * one a player may want to understand.
 */
interface Props {
  /** Prefixes the `data-testid` of the switch, its (?) and what that unfolds. */
  readonly id: string;
  readonly label: string;
  readonly on: boolean;
  readonly disabled?: boolean;
  readonly explanation: React.ReactNode;
  readonly onToggle: () => void;
}

export function ExplainedSwitch({id, label, on, disabled, explanation, onToggle}: Props): React.JSX.Element {
  const {settings} = useMessages();
  const [explained, setExplained] = useState(false);
  const explanationId = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <Switch testId={`${id}-toggle`} label={label} on={on} disabled={disabled} onToggle={onToggle} />

        <ExplanationToggle
          testId={`${id}-explain`}
          ariaLabel={settings.whatItMeans(label)}
          expanded={explained}
          controls={explanationId}
          onToggle={() => setExplained(shown => !shown)}
        />
      </div>

      {explained && (
        <div
          id={explanationId}
          data-testid={`${id}-explanation`}
          className="rounded-xl bg-black/25 p-3 text-sm text-white/85"
        >
          {explanation}
        </div>
      )}
    </div>
  );
}
