import {GamePage} from "@src/react/pages/game/GamePage";
import {Toast} from "@src/react/toast/Toast";
import {ReleaseUpdate} from "@src/react/release-update/ReleaseUpdate";

/** The shell. Routing and providers land here; screens live under `pages/`. */
export function App(): React.JSX.Element {
  return (
    <>
      <GamePage />

      <ReleaseUpdate />

      <Toast />
    </>
  );
}
