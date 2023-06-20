import { atom } from "jotai";
import { type FeedTypes } from "~/types/feeds";

type MainState = {
  feedType: FeedTypes;
};
const mainState: MainState = {
  feedType: "focus",
};

export const feedTypeAtom = atom(mainState.feedType);
