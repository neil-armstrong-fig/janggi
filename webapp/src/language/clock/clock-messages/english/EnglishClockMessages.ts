import type {ClockMessages} from "@src/language/clock/clock-messages/ClockMessages";

/** The clock, on the plaques and in the Play tab, in English. */
export const ENGLISH_CLOCK_MESSAGES: ClockMessages = {
  label: "Clock",
  formatLabel: "Time",
  formats: {
    "5 min": "5 min + 30s ×3",
    "10 min": "10 min + 30s ×3",
    "20 min": "20 min + 30s ×3",
    Custom: "Custom",
  },
  minutes: "Minutes",
  secondsAPeriod: "Seconds a period",
  periods: "Periods",
  explanation: {
    intro: "Each player has their own clock, which only runs on their turn. It has two parts.",
    freeTime: "First comes free time: minutes to spend however you like across the whole game.",
    overtime:
      "When that runs out you are in overtime (초읽기), and each move must be made within a short period. Move in time and the period starts again in full for your next move. Let it run out and it is used up, and the next one starts.",
    lostOnTime: "Run out of your last period and you lose on time (시간패), however well you were doing on the board.",
    readingAFormat: "So 5 min + 30s ×3 means 5 minutes of free time, then 3 overtime periods of 30 seconds each.",
    smallPrint:
      "Time starts after the first move and runs even with the app in the background; a reload holds it until you resume. Moves cannot be taken back. On a plaque, 0:27 ×2 means 27 seconds left, with 2 periods left, including this one.",
  },
};
