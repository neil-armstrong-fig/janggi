import {isCheckmate} from "@janggi/engine/check/IsCheckmate";
import {askedTargetOf} from "@src/react/pages/game/components/tutorial/asked-target/AskedTargetOf";
import {TUTORIAL_SCENES} from "@src/react/pages/game/tutorial/TutorialScenes";
import {edgeOf} from "@src/react/pages/game/components/tutorial/edge/EdgeOf";
import {closeTheTutorial} from "@src/redux/tutorial/actions/CloseTheTutorial";
import {startTheTutorialScene} from "@src/redux/tutorial/actions/StartTheTutorialScene";
import {TourSpotlight} from "@src/react/pages/game/components/tour-spotlight/TourSpotlight";
import {TutorialCard} from "@src/react/pages/game/components/tutorial/components/tutorial-card/TutorialCard";
import {leaveTheTutorial} from "@src/redux/tutorial/actions/LeaveTheTutorial";
import {useAppDispatch, useAppSelector} from "@src/redux/Hooks";
import {lookAtOf} from "@src/react/pages/game/components/tutorial/look-at/LookAtOf";
import {nextSceneNameOf} from "@src/react/pages/game/components/tutorial/card-words/NextSceneNameOf";
import {narrationWordsOf} from "@src/react/pages/game/components/tutorial/card-words/NarrationWordsOf";
import {useMessages} from "@src/react/pages/game/hooks/use-messages/UseMessages";
import {useTargetRect} from "@src/react/pages/game/hooks/use-target-rect/UseTargetRect";
import {controlsClearanceOf} from "@src/react/pages/game/components/tutorial/controls-clearance/ControlsClearanceOf";
import {useTutorialSituation} from "@src/react/pages/game/hooks/use-tutorial-situation/UseTutorialSituation";

/**
 * The guided tutorial over the game: a ring round what the step asks the player to tap — a point
 * on the board, or Pass, Bikjang or Draw — and the card saying what the step teaches, and once a scene is over, how it
 * ended and Next, for the scene after it. The board does the rest — it offers only the move asked for, the controls only
 * the one asked for, and the script answers for the other army (`useScriptedOpponent`). Drawn only while the tutorial
 * has the board. After the last scene, its closing card (`tutorial.closing`), over the board that scene left, which
 * completes the tutorial and offers Finish.
 *
 * The card never stands over what the ring is round, and of the two edges left it takes the one where it covers less of
 * the board (`cardDockOf`) — on a phone, the room under the board. The ring is not drawn
 * while a sheet is up, which would otherwise stand under it. On a wide screen the card stands clear of the row of controls
 * when it is at the bottom, so Settings is never under it; on a phone only the card tucked away does.
 */
export function Tutorial(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const {tutorial} = useMessages();
  const situation = useTutorialSituation();
  const sheetUp = useAppSelector(state => state.settings.openSheet !== undefined);
  const askingFor = askedTargetOf(situation);
  const rect = useTargetRect(askingFor);
  const controls = useTargetRect("controls");
  const board = useTargetRect("board");
  // The tutorial's game is Cho's to win, so it is won once Han, to move, has no way out of check.
  const won = useAppSelector(state => isCheckmate(state.game.played.present, "han"));

  if (situation === undefined) return <></>;

  const controlsClearance = controlsClearanceOf(controls);
  const leave = (): void => {
    dispatch(leaveTheTutorial());
  };

  if (situation.scene === TUTORIAL_SCENES.length) {
    return (
      <TutorialCard
        sceneName={tutorial.closing.name}
        sceneNumber={situation.scene + 1}
        number={situation.number}
        steps={0}
        narration={tutorial.closing.narration}
        replying={false}
        askingFor={undefined}
        controlsClearance={controlsClearance}
        won={false}
        closing
        ring={undefined}
        board={board}
        lookingAt={undefined}
        nextSceneName={undefined}
        onLeave={leave}
      />
    );
  }

  const scene = TUTORIAL_SCENES[situation.scene];
  if (scene === undefined) return <></>;

  const sceneWords = tutorial.scenes[scene.name];
  const next = TUTORIAL_SCENES[situation.scene + 1];

  return (
    <>
      {askingFor && rect && !sheetUp && <TourSpotlight target={askingFor} rect={rect} />}

      <TutorialCard
        sceneName={sceneWords.name}
        sceneNumber={situation.scene + 1}
        number={situation.number}
        steps={scene.steps.length}
        narration={narrationWordsOf(sceneWords, situation)}
        replying={situation.step?.actor === "opponent"}
        askingFor={askingFor}
        controlsClearance={controlsClearance}
        won={won}
        closing={false}
        ring={rect}
        board={board}
        lookingAt={edgeOf(lookAtOf(scene, situation))}
        nextSceneName={nextSceneNameOf(situation, next, tutorial)}
        onNext={() => {
          if (next) {
            dispatch(startTheTutorialScene(situation.scene + 1, next.start));
          } else {
            dispatch(closeTheTutorial(TUTORIAL_SCENES.length));
          }
        }}
        onLeave={leave}
      />
    </>
  );
}
