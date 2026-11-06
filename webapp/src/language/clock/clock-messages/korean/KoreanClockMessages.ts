import type {ClockMessages} from "@src/language/clock/clock-messages/ClockMessages";

/** The clock, on the plaques and in the Play tab, in Korean. */
export const KOREAN_CLOCK_MESSAGES: ClockMessages = {
  label: "대국 시계",
  formatLabel: "시간",
  formats: {
    "5 min": "5분 + 30초 ×3",
    "10 min": "10분 + 30초 ×3",
    "20 min": "20분 + 30초 ×3",
    Custom: "직접 설정",
  },
  minutes: "분",
  secondsAPeriod: "초읽기 한 번의 초",
  periods: "초읽기 횟수",
  explanation: {
    intro: "두 사람은 각자 시계를 가지며, 시계는 자기 차례에만 흐릅니다. 시간은 두 부분으로 나뉩니다.",
    freeTime: "먼저 자유시간입니다. 대국 전체에 걸쳐 마음대로 나누어 쓸 수 있는 시간입니다.",
    overtime:
      "자유시간을 다 쓰면 초읽기에 들어가, 정해진 짧은 시간 안에 한 수씩 두어야 합니다. 시간 안에 두면 다음 수에 그 시간이 처음부터 다시 주어집니다. 시간을 넘기면 그 초읽기 한 번이 사라지고 다음 초읽기가 시작됩니다.",
    lostOnTime: "마지막 초읽기까지 다 쓰면 판의 형세와 상관없이 시간패로 집니다.",
    readingAFormat: "5분 + 30초 ×3은 자유시간 5분에 이어 30초짜리 초읽기 3번을 뜻합니다.",
    smallPrint:
      "시간은 첫 수를 둔 뒤부터 흐르며 앱이 백그라운드에 있어도 멈추지 않고, 새로고침하면 다시 시작할 때까지 멈춥니다. 둔 수는 물릴 수 없습니다. 이름표의 0:27 ×2는 27초가 남았고, 지금 것을 포함해 초읽기가 2번 남았다는 뜻입니다.",
  },
};
