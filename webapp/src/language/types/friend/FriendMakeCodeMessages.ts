import type {Side} from "@janggi/shared/janggi/pieces/Side";

export interface FriendMakeCodeMessages {
  readonly title: string;
  readonly chooseArmy: string;
  readonly sides: Record<Side, string>;
  readonly create: string;
  readonly failed: string;
}
