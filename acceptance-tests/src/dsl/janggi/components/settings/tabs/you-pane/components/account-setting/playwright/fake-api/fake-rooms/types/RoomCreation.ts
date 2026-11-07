import type {RoomAsked} from "@src/dsl/janggi/components/settings/tabs/you-pane/components/account-setting/types/RoomAsked";

export interface RoomCreation {
  readonly asked: RoomAsked;
  readonly host: object;
}
