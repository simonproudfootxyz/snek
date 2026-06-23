import { SCORE_BY_ITEM } from "./constants";
import type { ItemType } from "./types";

export function scoreDelta(itemType: ItemType): number {
  return SCORE_BY_ITEM[itemType];
}
