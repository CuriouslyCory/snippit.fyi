import { type Dispatch, type SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { type FeedTypes } from "~/types/feeds";
import { useAtom } from "jotai";
import { feedTypeAtom } from "~/app-state/main";

export const FeedTypeSelect = () => {
  const [feedType, setFeedtype] = useAtom(feedTypeAtom);
  return (
    <div className="">
      <span className="text-sm opacity-75">Feed Type</span>
      <Select
        defaultValue={feedType}
        onValueChange={(fieldValue) => setFeedtype(fieldValue as FeedTypes)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Focused" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="focus">Focused</SelectItem>
          <SelectItem value="followed">Followed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
