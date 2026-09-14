import type {RatedGameInProgress} from "@src/redux/ratings/types/RatedGameInProgress";
import type {RatingsSliceState} from "@src/redux/ratings/types/RatingsSliceState";
import {beforeEach, describe, expect, it} from "vitest";
import {
  ratedGameAbandoned,
  ratedGameFinished,
  ratedGameStarted,
  ratingsReducer,
  recordReset,
} from "@src/redux/ratings/RatingsSlice";
import {freshRatings} from "@src/redux/ratings/fresh-ratings/FreshRatings";

const casualAgainst1200: RatedGameInProgress = {
  format: "Casual",
  botElo: 1200,
  playerSide: "cho",
  startedAt: "2026-09-14T10:00:00.000Z",
};

const FINISHED_AT = "2026-09-14T10:20:00.000Z";

let state: RatingsSliceState;

describe("before any game against the bot", () => {
  beforeEach(() => {
    state = freshRatings();
  });

  it("rates nothing that was never started", () => {
    expect(
      ratingsReducer(state, ratedGameFinished({result: "won", ending: "checkmate", finishedAt: FINISHED_AT})),
    ).toEqual(state);
    expect(ratingsReducer(state, ratedGameAbandoned(FINISHED_AT))).toEqual(state);
  });

  describe("once a casual game has begun", () => {
    beforeEach(() => {
      state = ratingsReducer(state, ratedGameStarted(casualAgainst1200));
    });

    it("holds the game as in progress", () => {
      expect(state.inProgress).toEqual(casualAgainst1200);
    });

    it("has not yet moved the rating", () => {
      expect(state.byFormat.Casual.elo).toBe(1200);
    });

    describe("and the player wins it", () => {
      beforeEach(() => {
        state = ratingsReducer(state, ratedGameFinished({result: "won", ending: "checkmate", finishedAt: FINISHED_AT}));
      });

      it("records the game", () => {
        expect(state.byFormat.Casual.games).toEqual([
          {
            format: "Casual",
            botElo: 1200,
            playerSide: "cho",
            result: "won",
            ending: "checkmate",
            eloBefore: 1200,
            eloAfter: 1220,
            finishedAt: FINISHED_AT,
          },
        ]);
      });

      it("raises the casual rating", () => {
        expect(state.byFormat.Casual.elo).toBe(1220);
      });

      it("leaves the scored rating where it was, the two being rated apart", () => {
        expect(state.byFormat.Scored).toEqual(freshRatings().byFormat.Scored);
      });

      it("has nothing left in progress", () => {
        expect(state.inProgress).toBeUndefined();
      });

      describe("and the record is then reset", () => {
        beforeEach(() => {
          state = ratingsReducer(state, recordReset());
        });

        it("puts both formats back where a player new to the bot starts, with no games behind them", () => {
          expect(state.byFormat).toEqual(freshRatings().byFormat);
        });
      });
    });

    describe("and the record is reset while it is still being played", () => {
      beforeEach(() => {
        state = ratingsReducer(state, recordReset());
      });

      it("keeps the game in progress, to be rated into the fresh record when it ends", () => {
        expect(state.inProgress).toEqual(casualAgainst1200);
      });
    });

    describe("and the player leaves it", () => {
      beforeEach(() => {
        state = ratingsReducer(state, ratedGameAbandoned(FINISHED_AT));
      });

      it("records it as a loss", () => {
        expect(state.byFormat.Casual.games[0]).toMatchObject({result: "lost", ending: "abandoned", eloAfter: 1180});
      });

      it("has nothing left in progress", () => {
        expect(state.inProgress).toBeUndefined();
      });
    });

    describe("and another is started before it is finished", () => {
      beforeEach(() => {
        state = ratingsReducer(state, ratedGameStarted({...casualAgainst1200, botElo: 800, startedAt: FINISHED_AT}));
      });

      it("rates the one left behind as abandoned", () => {
        expect(state.byFormat.Casual.games).toHaveLength(1);
        expect(state.byFormat.Casual.games[0]).toMatchObject({botElo: 1200, result: "lost", ending: "abandoned"});
      });

      it("holds the new one as in progress", () => {
        expect(state.inProgress).toMatchObject({botElo: 800});
      });
    });
  });
});
