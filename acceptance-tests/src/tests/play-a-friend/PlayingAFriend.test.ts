import {beforeEach, expect, given, then, when} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import type {Janggi} from "@src/acceptance-criteria-mapping/AcceptanceCriteriaMapping";
import type {FriendCode} from "@janggi/shared/janggi/online/friend-code/FriendCode";

/**
 * Two people play one game by a friend code: one makes the code and chooses their army, the other types it in (or opens
 * the link it came in), and the room seats them, introduces them and deals the game once each has chosen an arrangement.
 * Both must be signed in, and each is told who the other is. The room is stood in for, as the API is — the real room's
 * judgement of a move is tested where it lives, and the page never offers a move it would refuse.
 *
 * `janggi` is the player who makes the code, and `friend` the one they play: another device, opened afresh for every
 * test (Playwright runs every hook of a test anew, so the variable is the test's own).
 */
given("two players, each signed in with Google as themselves", () => {
  let friend: Janggi;
  let firstCode: FriendCode | undefined;

  beforeEach(async ({janggi}) => {
    friend = await janggi.openSeparateDevice();

    await janggi.settings.account.signInWithGoogle();
    await friend.settings.account.signInWithGoogleAsAnotherPlayer();
    await janggi.playAFriend.openPlayAFriend();
    await friend.playAFriend.openPlayAFriend();
  });

  then("the sheet is set to keep a room the longest, which is the most a friend is given", async ({janggi}) => {
    expect(await janggi.playAFriend.getHowLongToKeepTheRoom()).toBe(90);
  });

  when("the first makes a code without choosing how long to keep the room", () => {
    beforeEach(async ({janggi}) => {
      await janggi.playAFriend.createACode("han");
    });

    then("the server is asked to keep it three months", async ({janggi}) => {
      expect(await janggi.settings.account.getRoomsAsked()).toEqual([{side: "han", awayDays: 90}]);
    });
  });

  when("the first chooses to keep the room 3 days, and makes a code", () => {
    beforeEach(async ({janggi}) => {
      await janggi.playAFriend.chooseHowLongToKeepTheRoom(3);
      await janggi.playAFriend.createACode("cho");
    });

    then("the server is asked to keep it 3 days, for the army they chose", async ({janggi}) => {
      expect(await janggi.settings.account.getRoomsAsked()).toEqual([{side: "cho", awayDays: 3}]);
    });
  });

  when("the first makes a code to play Han", () => {
    beforeEach(async ({janggi}) => {
      await janggi.playAFriend.createACode("han");
    });

    then("the sheet shows the code to give their friend", async ({janggi}) => {
      expect(await janggi.playAFriend.getCode()).toBeDefined();
    });

    then("the game says it is waiting for the friend", async ({janggi}) => {
      await expect.poll(() => janggi.playAFriend.getState()).toBe("waiting-for-a-friend");
    });

    then("the banner says it is waiting for the friend to join", async ({janggi}) => {
      await expect.poll(() => janggi.playAFriend.getStatusWords()).toBe("Waiting for friend to join");
    });

    when("the first closes the sheet and plays a soldier forward in their own game while they wait", () => {
      beforeEach(async ({janggi}) => {
        await janggi.playAFriend.closeTheSheet();
        await janggi.board.tap(1, 7);
        await janggi.board.tap(1, 6);
      });

      then("the soldier has moved on their board", async ({janggi}) => {
        await expect.poll(() => janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
      });

      then("the game is still waiting for the friend", async ({janggi}) => {
        expect(await janggi.playAFriend.getState()).toBe("waiting-for-a-friend");
      });

      when("the friend joins, they play, and the first leaves once it is over", () => {
        beforeEach(async ({janggi}) => {
          await friend.playAFriend.joinWithCode(await codeOf(janggi));
          await chooseArrangements(janggi, friend);
          await friend.playAFriend.resign();
          await expect.poll(() => janggi.playAFriend.getState()).toBe("over");
          await janggi.playAFriend.leave();
        });

        then("the first's own game is back as they left it, with the soldier moved", async ({janggi}) => {
          await expect.poll(() => janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
          expect(await janggi.board.getPieceAt(1, 7)).toBeUndefined();
        });
      });
    });

    when("the first closes the sheet and leaves from the banner", () => {
      beforeEach(async ({janggi}) => {
        await janggi.playAFriend.closeTheSheet();
        await janggi.playAFriend.leave();
      });

      then("there is no game with a friend any more", async ({janggi}) => {
        await expect.poll(() => janggi.playAFriend.getState()).toBe("idle");
      });
    });

    when("their friend types the code in", () => {
      beforeEach(async ({janggi}) => {
        await friend.playAFriend.joinWithCode(await codeOf(janggi));
      });

      then("the first is told who they are playing", async ({janggi}) => {
        await expect.poll(() => janggi.playAFriend.getOpponentName()).toBe("Yi Sun-sin");
      });

      then("the friend is told who they are playing", async () => {
        await expect.poll(() => friend.playAFriend.getOpponentName()).toBe("Kim Yu-sin");
      });

      then("the first has the army they asked for, and the friend the other", async ({janggi}) => {
        await expect.poll(() => janggi.playAFriend.getOwnSide()).toBe("han");
        await expect.poll(() => friend.playAFriend.getOwnSide()).toBe("cho");
      });

      then("the two have yet to choose their arrangements", async ({janggi}) => {
        await expect.poll(() => janggi.playAFriend.getState()).toBe("choosing-setups");
      });

      when("they have each chosen an arrangement", () => {
        beforeEach(async ({janggi}) => {
          await chooseArrangements(janggi, friend);
        });

        then("the game is being played", async ({janggi}) => {
          await expect.poll(() => janggi.playAFriend.getState()).toBe("playing");
          await expect.poll(() => friend.playAFriend.getState()).toBe("playing");
        });

        then("each has their own army's plaque marked, and not the other's", async ({janggi}) => {
          await expect.poll(() => janggi.playAFriend.isMarkedAsYours("han")).toBe(true);
          expect(await janggi.playAFriend.isMarkedAsYours("cho")).toBe(false);
          await expect.poll(() => friend.playAFriend.isMarkedAsYours("cho")).toBe(true);
          expect(await friend.playAFriend.isMarkedAsYours("han")).toBe(false);
        });

        then(
          "the friend, who has Cho and so moves first, is told it is their turn, and the first is not",
          async ({janggi}) => {
            await expect.poll(() => friend.playAFriend.isYourTurn()).toBe(true);
            await expect.poll(() => janggi.playAFriend.isYourTurn()).toBe(false);
          },
        );

        when("the friend, who has Cho and so moves first, plays a soldier forward", () => {
          beforeEach(async () => {
            await friend.board.tap(1, 7);
            await friend.board.tap(1, 6);
          });

          then("it is the first's turn", async ({janggi}) => {
            await expect.poll(() => janggi.status.getTurn()).toBe("han");
          });

          then("the first is told it is their turn, and the friend is not", async ({janggi}) => {
            await expect.poll(() => janggi.playAFriend.isYourTurn()).toBe(true);
            await expect.poll(() => friend.playAFriend.isYourTurn()).toBe(false);
          });

          then("the soldier has moved on the first's board too", async ({janggi}) => {
            await expect.poll(() => janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
          });

          when("the first closes the app and opens it again", () => {
            beforeEach(async ({janggi}) => {
              await janggi.playAFriend.reopenTheApp();
            });

            then("the first is back in the game", async ({janggi}) => {
              await expect.poll(() => janggi.playAFriend.getState()).toBe("playing");
            });

            then("the game is where it was, with the soldier moved and the first to play", async ({janggi}) => {
              await expect.poll(() => janggi.board.getPieceAt(1, 6)).toEqual({side: "cho", type: "soldier"});
              await expect.poll(() => janggi.status.getTurn()).toBe("han");
            });

            then("the first is still told who they are playing", async ({janggi}) => {
              await expect.poll(() => janggi.playAFriend.getOpponentName()).toBe("Yi Sun-sin");
            });

            when("the friend resigns and the first leaves the game", () => {
              beforeEach(async ({janggi}) => {
                await expect.poll(() => janggi.playAFriend.getState()).toBe("playing");
                firstCode = await janggi.playAFriend.getCode();
                await friend.playAFriend.resign();
                await expect.poll(() => janggi.playAFriend.getState()).toBe("over");
                await janggi.playAFriend.leave();
              });

              then("the first's own game is back on the board, as it was before the friend's", async ({janggi}) => {
                await expect.poll(() => janggi.board.getPieceAt(1, 7)).toEqual({side: "cho", type: "soldier"});
                expect(await janggi.board.getPieceAt(1, 6)).toBeUndefined();
              });

              then("there is no game with a friend any more", async ({janggi}) => {
                expect(await janggi.playAFriend.getState()).toBe("idle");
              });

              when("the first makes another code", () => {
                beforeEach(async ({janggi}) => {
                  await janggi.playAFriend.openPlayAFriend();
                  await janggi.playAFriend.createACode("han");
                });

                then("it is a new room, waiting for a friend, and not the game they resigned", async ({janggi}) => {
                  await expect.poll(() => janggi.playAFriend.getState()).toBe("waiting-for-a-friend");
                  expect(await janggi.playAFriend.getCode()).not.toBe(firstCode);
                });
              });
            });
          });
        });

        when("the first tries to pick up their friend's soldier while it is the friend's turn", () => {
          beforeEach(async ({janggi}) => {
            await janggi.board.tap(1, 7);
          });

          then("it is not picked up", async ({janggi}) => {
            expect(await janggi.board.isSelected(1, 7)).toBe(false);
          });
        });

        when("the friend loses their connection", () => {
          beforeEach(async () => {
            await friend.settings.account.dropTheFriendConnection();
          });

          then("the first is told their friend has left", async ({janggi}) => {
            await expect.poll(() => janggi.playAFriend.getState()).toBe("opponent-left");
          });

          then("the friend is told they are reconnecting", async () => {
            await expect.poll(() => friend.playAFriend.getConnection()).toBe("reconnecting");
          });

          when("the friend is connected again", () => {
            beforeEach(async ({janggi}) => {
              await expect.poll(() => janggi.playAFriend.getState()).toBe("opponent-left");
              await friend.settings.account.restoreTheFriendConnection();
            });

            then("the game goes on", async ({janggi}) => {
              await expect.poll(() => janggi.playAFriend.getState()).toBe("playing");
            });

            then("the friend is told they are connected again", async () => {
              await expect.poll(() => friend.playAFriend.getConnection(), {timeout: 30_000}).toBe("connected");
            });
          });
        });

        when("the friend is out of reach and the rooms are let go, and then the friend is back in reach", () => {
          beforeEach(async ({janggi}) => {
            await friend.settings.account.dropTheFriendConnection();
            await janggi.settings.account.letGoOfTheRooms();
            await friend.settings.account.restoreTheFriendConnection();
          });

          then("the first is out of a game with a room that is gone", async ({janggi}) => {
            await expect.poll(() => janggi.playAFriend.getState()).toBe("idle");
          });

          then("the friend, who comes back to it, is told it is gone and stops trying", async () => {
            await expect.poll(() => friend.playAFriend.getState()).toBe("idle");
          });
        });

        when("the friend resigns", () => {
          beforeEach(async () => {
            await friend.playAFriend.resign();
          });

          then("the game is over for both", async ({janggi}) => {
            await expect.poll(() => janggi.playAFriend.getState()).toBe("over");
            await expect.poll(() => friend.playAFriend.getState()).toBe("over");
          });
        });
      });
    });

    when("their friend types it in as it was read out, in lower case with a hyphen", () => {
      beforeEach(async ({janggi}) => {
        const code = await codeOf(janggi);

        await friend.playAFriend.joinWithCode(`${code.slice(0, 4)}-${code.slice(4)}`.toLowerCase());
      });

      then("the friend is told who they are playing", async () => {
        await expect.poll(() => friend.playAFriend.getOpponentName()).toBe("Kim Yu-sin");
      });
    });

    when("their friend opens the link instead of typing the code", () => {
      beforeEach(async ({janggi}) => {
        await friend.playAFriend.openTheLink(await codeOf(janggi));
      });

      then("the friend is told who they are playing, with no code typed", async () => {
        await expect.poll(() => friend.playAFriend.getOpponentName()).toBe("Kim Yu-sin");
      });

      then("the first is told who they are playing", async ({janggi}) => {
        await expect.poll(() => janggi.playAFriend.getOpponentName()).toBe("Yi Sun-sin");
      });
    });
  });

  when("the first makes a code to play Cho, and their friend types it in", () => {
    beforeEach(async ({janggi}) => {
      await janggi.playAFriend.createACode("cho");
      await friend.playAFriend.joinWithCode(await codeOf(janggi));
    });

    then("the first has the army they asked for", async ({janggi}) => {
      await expect.poll(() => janggi.playAFriend.getOwnSide()).toBe("cho");
    });

    when("they have each chosen an arrangement", () => {
      beforeEach(async ({janggi}) => {
        await chooseArrangements(friend, janggi);
      });

      then("the first, who has Cho, is the one to move, as Cho always is", async ({janggi}) => {
        await expect.poll(() => janggi.status.getTurn()).toBe("cho");
      });
    });
  });

  when("the friend types in a code no room has", () => {
    beforeEach(async () => {
      await friend.playAFriend.joinWithCode("FAKE9999");
    });

    then("the code is turned away", async () => {
      await expect.poll(() => friend.playAFriend.isJoinRefused()).toBe(true);
    });
  });

  when("the friend types in something that is not a code", () => {
    beforeEach(async () => {
      await friend.playAFriend.joinWithCode("hello");
    });

    then("the code is turned away", async () => {
      await expect.poll(() => friend.playAFriend.isJoinRefused()).toBe(true);
    });
  });
});

/** The code a device's sheet is showing, which a friend is then given. */
async function codeOf(host: Janggi): Promise<FriendCode> {
  await expect.poll(() => host.playAFriend.getCode()).toBeDefined();

  const code = await host.playAFriend.getCode();
  if (code === undefined) throw new Error("The sheet showed no code");

  return code;
}

/** Han chooses the inner elephant and Cho the outer, so the two are told apart. */
async function chooseArrangements(han: Janggi, cho: Janggi): Promise<void> {
  await han.playAFriend.chooseSetup("Inner Elephant");
  await cho.playAFriend.chooseSetup("Outer Elephant");
}
