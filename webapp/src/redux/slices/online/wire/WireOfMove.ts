import type {Move} from "@janggi/engine/types/Move";
import type {WireMove} from "@janggi/shared/janggi/online/messages/action/WireMove";

export function wireOfMove({from, to}: Move): WireMove {
  return {from: {file: from.file, rank: from.rank}, to: {file: to.file, rank: to.rank}};
}
