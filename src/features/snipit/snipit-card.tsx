import { type SnipitTag, type Snipit, type Tag } from "@prisma/client";
import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { GrCheckboxSelected, GrCheckbox } from "react-icons/gr";
import { api } from "~/utils/api";

type SnipitCardProps = {
  snipit: Snipit & {
    tags: (SnipitTag & {
      tag: Tag;
    })[];
  };
  onChecked?: () => void;
};

function SnipitCard({ snipit, onChecked }: SnipitCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const updateNumFollowsMutation = api.snipit.updateNumFollows.useMutation();
  const updateNumCheckedMutation = api.snipit.updateNumChecked.useMutation();

  useEffect(() => {
    // Check if the user has a SnipitInteraction record for this snipit
    // and set isFollowing and isChecked accordingly
  }, [snipit]);

  const handleFollow = async () => {
    try {
      await updateNumFollowsMutation.mutateAsync({
        snipitId: snipit.id,
        increment: !isFollowing,
      });
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error updating numFollows", error);
    }
  };

  const handleCheck = async () => {
    try {
      await updateNumCheckedMutation.mutateAsync({ snipitId: snipit.id });
      setIsChecked(!isChecked);
      if (onChecked) onChecked();
    } catch (error) {
      console.error("Error updating numChecked", error);
    }
  };

  return (
    <div className="rounded border p-4">
      <div className="mb-4">{snipit.prompt}</div>
      <div className="flex items-center justify-between">
        <div>
          {snipit.tags?.map((tag) => (
            <span
              key={tag.tagId}
              className="mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
            >
              {tag.tag.name}
            </span>
          ))}
        </div>
        <div className="flex items-center">
          <button onClick={handleFollow} className="flex items-center">
            {isFollowing ? (
              <AiFillHeart className="text-red-500" />
            ) : (
              <AiOutlineHeart />
            )}
            <span className="ml-1">{snipit.numFollows}</span>
          </button>
          <button onClick={handleCheck} className="ml-4 flex items-center">
            {isChecked ? (
              <GrCheckboxSelected className="text-green-500" />
            ) : (
              <GrCheckbox />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SnipitCard;
