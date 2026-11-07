import {KOREAN_GUIDED_GAME_WORDS} from "@src/language/tutorial/entry-words/korean/KoreanGuidedGameWords";
import type {TutorialMessages} from "@src/language/tutorial/tutorial-messages/TutorialMessages";
import {KOREAN_AN_AGREEMENT} from "@src/language/tutorial/tutorial-scene-words/korean/KoreanAnAgreement";
import {KOREAN_A_BIKJANG} from "@src/language/tutorial/tutorial-scene-words/korean/KoreanABikjang";
import {KOREAN_A_REPETITION} from "@src/language/tutorial/tutorial-scene-words/korean/KoreanARepetition";
import {KOREAN_RESTING_TURNS} from "@src/language/tutorial/tutorial-scene-words/korean/KoreanRestingTurns";
import {KOREAN_THE_WHOLE_GAME} from "@src/language/tutorial/tutorial-scene-words/korean/KoreanTheWholeGame";

/**
 * The guided tutorial in Korean, in the guide's own words for the pieces and their moves (말, 뛰어넘다, 궁성). Awaiting a
 * native speaker's review, as the rest of the Korean is (`docs/localisation.md`).
 */
export const KOREAN_TUTORIAL_MESSAGES: TutorialMessages = {
  scenes: {
    "the-whole-game": KOREAN_THE_WHOLE_GAME,
    "a-bikjang": KOREAN_A_BIKJANG,
    "a-repetition": KOREAN_A_REPETITION,
    "resting-turns": KOREAN_RESTING_TURNS,
    "an-agreement": KOREAN_AN_AGREEMENT,
  },
  closing: {
    name: "시간패",
    narration: {
      title: "시간패: 시간이 다 되면",
      body: "안내 대국에서는 말로만 알려 드릴 수 있는 끝이 하나 더 있습니다. 시계를 쓰는 대국에서는 시간을 다 쓴 쪽이 판의 형세와 상관없이 지며, 이를 시간패라고 합니다. 안내 대국에는 시계가 없으며, 게임 탭에서 시계를 켤 수 있습니다. 안내 대국은 여기까지입니다. 마치기를 누르면 원래 대국으로 돌아갑니다.",
    },
  },
  card: {
    label: "안내 대국",
    stepOf: (sceneName, step) => `${sceneName} · ${step}단계`,
    over: sceneName => `${sceneName} · 끝`,
    hide: "접기",
    show: "펼치기",
    leave: "안내 대국 나가기",
    finish: "마치기",
    answering: "한이 응수하는 중…",
    next: sceneName => `다음: ${sceneName}`,
  },
  you: {
    ...KOREAN_GUIDED_GAME_WORDS,
    aGuidedGame: "안내를 따라 두는 대국",
    sceneOf: (scene, count) => `${count}개 장면 중 ${scene}번째`,
    afterYourGame: "레이팅 대국이나 친구 대국을 마친 뒤에",
    startOver: "안내 대국 처음부터 하기",
  },
  holdsPlay:
    "안내 대국이 판을 쓰고 있습니다. 상대, 방식, 상차림을 고르거나 새 대국을 시작하려면 안내 대국에서 나가세요.",
};
