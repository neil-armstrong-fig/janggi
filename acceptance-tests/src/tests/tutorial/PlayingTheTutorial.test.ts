import {
  beforeEach,
  expect,
  given,
  then,
  useFreshPlayer,
  when,
} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";

/**
 * The guided tutorial: a fixed game in which the player is told which move to make and the other army
 * answers by itself, then a short scene for each other way a game ends, and a card telling of the last.
 */
given("a player with a game of their own under way", () => {
  beforeEach(async ({janggi}) => {
    await janggi.board.tap(1, 7);
    await janggi.board.tap(1, 6);
  });

  when("they start the tutorial from the You tab", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.you.startTheTutorial();
    });

    then("the tutorial is shown", async ({janggi}) => {
      expect(await janggi.tutorial.isShown()).toBe(true);
    });

    then("it is on its first step", async ({janggi}) => {
      expect(await janggi.tutorial.getStep()).toBe(1);
    });

    then("their own game is put aside for a fresh board", async ({janggi}) => {
      expect(await janggi.board.getPieceAt(1, 7)).toEqual({side: "cho", type: "soldier"});
      expect(await janggi.board.getPieceAt(1, 6)).toBeUndefined();
    });

    then("it points at the piece to move", async ({janggi}) => {
      expect(await janggi.tutorial.getSpotlightedPoint()).toEqual({file: 3, rank: 7});
    });

    then("it rings the point to tap", async ({janggi}) => {
      await expect.poll(() => janggi.tutorial.isSpotlightShown()).toBe(true);
    });

    then("the Play tab cannot deal a game over it", async ({janggi}) => {
      expect(await janggi.settings.play.canStartNewGame()).toBe(false);
    });

    when("they tuck the card away", () => {
      beforeEach(async ({janggi}) => {
        await janggi.tutorial.collapse();
      });

      then("its words are put away, leaving only its title", async ({janggi}) => {
        expect(await janggi.tutorial.isNarrationShown()).toBe(false);
        expect(await janggi.tutorial.isTitleShown()).toBe(true);
      });

      when("they bring it back", () => {
        beforeEach(async ({janggi}) => {
          await janggi.tutorial.expand();
        });

        then("its words are shown again", async ({janggi}) => {
          expect(await janggi.tutorial.isNarrationShown()).toBe(true);
        });
      });
    });

    when("they open the settings", () => {
      beforeEach(async ({janggi}) => {
        await janggi.settings.openTheSettings();
      });

      then("the ring is not drawn over the sheet", async ({janggi}) => {
        expect(await janggi.tutorial.isSpotlightShown()).toBe(false);
      });
    });

    when("they try to pick up a piece it did not ask for", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(1, 7);
      });

      then("nothing is picked up", async ({janggi}) => {
        expect(await janggi.board.isSelected(1, 7)).toBe(false);
      });
    });

    when("they pick up the piece it points at", () => {
      beforeEach(async ({janggi}) => {
        await janggi.board.tap(3, 7);
      });

      then("it points at where to put it", async ({janggi}) => {
        expect(await janggi.tutorial.getSpotlightedPoint()).toEqual({file: 3, rank: 6});
      });

      then("that is the only place it may go", async ({janggi}) => {
        expect(await janggi.board.canMoveTo(3, 6)).toBe(true);
        expect(await janggi.board.canMoveTo(2, 7)).toBe(false);
        expect(await janggi.board.canMoveTo(4, 7)).toBe(false);
      });

      when("they put it there", () => {
        beforeEach(async ({janggi}) => {
          await janggi.board.tap(3, 6);
          await janggi.tutorial.waitForTheReply();
        });

        then("the other army answers by itself", async ({janggi}) => {
          expect(await janggi.board.getPieceAt(3, 5)).toEqual({side: "han", type: "soldier"});
        });

        then("the tutorial goes on to the step after the answer", async ({janggi}) => {
          expect(await janggi.tutorial.getStep()).toBe(3);
        });

        then("no control under the board can take the game off its script", async ({janggi}) => {
          expect(await janggi.status.controls.canUndo()).toBe(false);
          expect(await janggi.status.controls.canPass()).toBe(false);
          expect(await janggi.status.controls.canOfferDraw()).toBe(false);
          expect(await janggi.status.controls.canCallBikjang()).toBe(false);
        });
      });
    });

    when("they leave it", () => {
      beforeEach(async ({janggi}) => {
        await janggi.tutorial.leave();
      });

      then("the tutorial is gone", async ({janggi}) => {
        expect(await janggi.tutorial.isShown()).toBe(false);
      });

      then("their own game is back as they left it", async ({janggi}) => {
        expect(await janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
        expect(await janggi.status.getTurn()).toBe("han");
      });
    });

    when("the page is reloaded", () => {
      beforeEach(async ({janggi}) => {
        await janggi.reload();
      });

      then("their own game is what comes back", async ({janggi}) => {
        expect(await janggi.tutorial.isShown()).toBe(false);
        expect(await janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
      });
    });
  });
});

given("a player in the tutorial", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.you.startTheTutorial();
  });

  when("they play every move it asks for", () => {
    beforeEach(async ({janggi}) => {
      await janggi.tutorial.playTheScene();
    });

    then("it offers the next scene, for the other ways a game ends", async ({janggi}) => {
      expect(await janggi.tutorial.isNextSceneOffered()).toBe(true);
    });

    when("they go on to the next scene and play it", () => {
      beforeEach(async ({janggi}) => {
        await janggi.tutorial.goOnToTheNextScene();
        await janggi.tutorial.playTheScene();
      });

      then("it is the second scene", async ({janggi}) => {
        expect(await janggi.tutorial.getScene()).toBe(2);
      });

      then("it ends drawn by a called bikjang", async ({janggi}) => {
        expect(await janggi.status.getDrawnBy()).toBe("bikjang");
      });

      then("the plaques show nothing as taken, the scene being posed rather than played to", async ({janggi}) => {
        expect(await janggi.status.plaque.takenTray.getTakenFrom("cho")).toEqual([]);
        expect(await janggi.status.plaque.takenTray.getTakenFrom("han")).toEqual([]);
      });

      when("they go on to the next scene and go round it to its last step", () => {
        beforeEach(async ({janggi}) => {
          await janggi.tutorial.goOnToTheNextScene();
          await janggi.tutorial.playTheSceneToItsLastStep();
        });

        then("the board holds back the move that would repeat the position a third time", async ({janggi}) => {
          expect(await janggi.status.overlay.repetitionNotice.isRepetitionExplained()).toBe(true);
        });

        then("the board marks the point the chariot may not go back to", async ({janggi}) => {
          expect(await janggi.tutorial.getHeldBackPoint()).toEqual({file: 1, rank: 10});
        });

        when("they make the move it asks for instead", () => {
          beforeEach(async ({janggi}) => {
            await janggi.tutorial.playTheScene();
          });

          then("the game goes on, not drawn", async ({janggi}) => {
            expect(await janggi.status.isDrawn()).toBe(false);
            expect(await janggi.tutorial.isNextSceneOffered()).toBe(true);
          });

          when("they go on to the next scene", () => {
            beforeEach(async ({janggi}) => {
              await janggi.tutorial.goOnToTheNextScene();
            });

            then("only the control it asks for is on", async ({janggi}) => {
              expect(await janggi.status.controls.canPass()).toBe(true);
              expect(await janggi.status.controls.canOfferDraw()).toBe(false);
              expect(await janggi.status.controls.canCallBikjang()).toBe(false);
              expect(await janggi.status.controls.canUndo()).toBe(false);
            });

            when("they play it", () => {
              beforeEach(async ({janggi}) => {
                await janggi.tutorial.playTheScene();
              });

              then("Cho wins on points, both having rested a turn", async ({janggi}) => {
                expect(await janggi.status.getWinner()).toBe("cho");
              });

              when("they go on to the last scene and play it", () => {
                beforeEach(async ({janggi}) => {
                  await janggi.tutorial.goOnToTheNextScene();
                  await janggi.tutorial.playTheScene();
                });

                then("it ends drawn by agreement", async ({janggi}) => {
                  expect(await janggi.status.getDrawnBy()).toBe("agreement");
                });

                then("it offers one card more", async ({janggi}) => {
                  expect(await janggi.tutorial.isNextSceneOffered()).toBe(true);
                });

                when("they go on to the closing card", () => {
                  beforeEach(async ({janggi}) => {
                    await janggi.tutorial.goOnToTheClosingCard();
                  });

                  then("the tutorial is closing, with nothing after it", async ({janggi}) => {
                    expect(await janggi.tutorial.isClosing()).toBe(true);
                    expect(await janggi.tutorial.isNextSceneOffered()).toBe(false);
                  });

                  then("finishing it earns 30 XP, over the million every spec opens with", async ({janggi}) => {
                    expect(await janggi.settings.you.progress.getXp()).toBe(1_000_030);
                  });

                  when("they finish it", () => {
                    beforeEach(async ({janggi}) => {
                      await janggi.tutorial.finish();
                    });

                    then("their own game is back", async ({janggi}) => {
                      expect(await janggi.tutorial.isShown()).toBe(false);
                    });

                    then("the You tab offers to play it again", async ({janggi}) => {
                      expect(await janggi.settings.you.getTutorialOffer()).toBe("again");
                      expect(await janggi.settings.play.isGuidedGameOffered()).toBe(false);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    then("Cho wins by 외통", async ({janggi}) => {
      expect(await janggi.status.getWinner()).toBe("cho");
    });

    then("the plaques show what the whole game took", async ({janggi}) => {
      expect(await janggi.status.plaque.takenTray.getTakenFrom("han")).not.toEqual([]);
    });

    then("the card says the game is won", async ({janggi}) => {
      expect(await janggi.tutorial.isGameWon()).toBe(true);
    });

    then("the result offers no new game over the tutorial", async ({janggi}) => {
      expect(await janggi.status.overlay.resultBanner.isNewGameOffered()).toBe(false);
    });

    when("on a phone, they tuck the card away and open the settings", () => {
      beforeEach(async ({janggi}) => {
        await janggi.resizeWindowTo(390, 844);
        await janggi.tutorial.collapse();
        await janggi.settings.openTheSettings();
      });

      then("the card is under the sheet", async ({janggi}) => {
        expect(await janggi.tutorial.isUnderTheSettings()).toBe(true);
      });
    });

    when("they tuck the card away and open the settings", () => {
      beforeEach(async ({janggi}) => {
        await janggi.tutorial.collapse();
        await janggi.settings.openTheSettings();
      });

      then("the settings open, the card standing clear of the button", async ({janggi}) => {
        expect(await janggi.settings.isOpen()).toBe(true);
      });
    });

    when("they leave it", () => {
      beforeEach(async ({janggi}) => {
        await janggi.tutorial.leave();
      });

      then("their own game is back, not over", async ({janggi}) => {
        expect(await janggi.status.overlay.resultBanner.isResultAnnounced()).toBe(false);
      });
    });
  });
});

given("a player who left the tutorial on its third scene, and came back later", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.you.startTheTutorial();
    await janggi.tutorial.playTheScene();
    await janggi.tutorial.goOnToTheNextScene();
    await janggi.tutorial.playTheScene();
    await janggi.tutorial.goOnToTheNextScene();
    await janggi.tutorial.leave();
    await janggi.reload();
  });

  then("the You tab offers to resume it, or to start it over", async ({janggi}) => {
    expect(await janggi.settings.you.getTutorialOffer()).toBe("resume");
    expect(await janggi.settings.you.isTutorialStartOverOffered()).toBe(true);
  });

  when("they resume it", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.you.startTheTutorial();
    });

    then("it opens on the third scene, at its first step", async ({janggi}) => {
      expect(await janggi.tutorial.getScene()).toBe(3);
      expect(await janggi.tutorial.getStep()).toBe(1);
    });
  });

  when("they start it over", () => {
    beforeEach(async ({janggi}) => {
      await janggi.settings.you.startTheTutorialOver();
    });

    then("it opens on the whole game, at its first step", async ({janggi}) => {
      expect(await janggi.tutorial.getScene()).toBe(1);
      expect(await janggi.tutorial.getStep()).toBe(1);
    });
  });

  when("they read the guide", () => {
    beforeEach(async ({janggi}) => {
      await janggi.guide.visitGuide();
    });

    then("its link to the tutorial offers to resume it", async ({janggi}) => {
      expect(await janggi.guide.getTutorialOffer()).toBe("resume");
    });

    when("they follow it", () => {
      beforeEach(async ({janggi}) => {
        await janggi.guide.playTheTutorial();
      });

      then("the game opens on the third scene", async ({janggi}) => {
        expect(await janggi.tutorial.getScene()).toBe(3);
      });
    });
  });
});

given("a player waiting in a friend room they made", () => {
  beforeEach(async ({janggi}) => {
    await janggi.settings.you.account.signInWithGoogle();
    await janggi.playAFriend.openPlayAFriend();
    await janggi.playAFriend.createACode("han");
    await janggi.playAFriend.closeTheSheet();
  });

  then("the tutorial cannot be started, the friend's game being dealt over it when they come", async ({janggi}) => {
    expect(await janggi.settings.you.canStartTheTutorial()).toBe(false);
  });
});

given("a player on their first visit", () => {
  useFreshPlayer();

  when("they choose the tutorial from the welcome", () => {
    beforeEach(async ({janggi}) => {
      await janggi.onboarding.continueTheWelcome();
      await janggi.onboarding.startTheTutorial();
    });

    then("the tutorial is shown", async ({janggi}) => {
      expect(await janggi.tutorial.isShown()).toBe(true);
    });

    then("the welcome is gone", async ({janggi}) => {
      expect(await janggi.onboarding.isWelcomeShown()).toBe(false);
    });
  });
});

given("a reader of the guide", () => {
  beforeEach(async ({janggi}) => {
    await janggi.guide.visitGuide();
  });

  then("its link offers to start the tutorial", async ({janggi}) => {
    expect(await janggi.guide.getTutorialOffer()).toBe("start");
  });

  when("they follow its link to the tutorial", () => {
    beforeEach(async ({janggi}) => {
      await janggi.guide.playTheTutorial();
    });

    then("the game opens on the tutorial", async ({janggi}) => {
      expect(await janggi.tutorial.isShown()).toBe(true);
      expect(await janggi.tutorial.getStep()).toBe(1);
    });
  });
});

given("a reader of the guide who has never played", () => {
  useFreshPlayer();

  beforeEach(async ({janggi}) => {
    await janggi.guide.visitGuide();
  });

  when("they follow its link to the tutorial", () => {
    beforeEach(async ({janggi}) => {
      await janggi.guide.playTheTutorial();
    });

    then("the welcome comes first, as on any first visit", async ({janggi}) => {
      await expect.poll(() => janggi.onboarding.isWelcomeShown()).toBe(true);
      expect(await janggi.tutorial.isShown()).toBe(false);
    });

    when("they go through the welcome and choose the tutorial at its end", () => {
      beforeEach(async ({janggi}) => {
        await janggi.onboarding.continueTheWelcome();
        await janggi.onboarding.startTheTutorial();
      });

      then("the tutorial is on its first step", async ({janggi}) => {
        expect(await janggi.tutorial.getStep()).toBe(1);
      });
    });
  });
});
