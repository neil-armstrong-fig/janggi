import {useInstallation} from "@src/react/pages/hooks/use-installation/UseInstallation";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";

export function InstallButton(): React.JSX.Element | undefined {
  const installation = useInstallation();
  const {you} = useMessages();
  if (!installation.canInstall) return undefined;

  return (
    <button
      type="button"
      data-testid="settings-install"
      onClick={installation.offerInstallation}
      className="flex min-h-11 w-full cursor-pointer items-center gap-4 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-sm text-gold hover:bg-gold/20 min-[38.0625rem]:hidden"
    >
      {you.links.install}
    </button>
  );
}
