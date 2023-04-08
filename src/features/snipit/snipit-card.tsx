import {
  type SnipitTag,
  type Snipit,
  type Tag,
  SnipitInteractions,
  User,
} from "@prisma/client";
import React, { useState, useEffect } from "react";
import {
  AiFillHeart,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineHeart,
} from "react-icons/ai";
import { UserAvatar } from "~/components/user-avatar";
import { api } from "~/utils/api";

type SnipitCardProps = {
  snipit: Snipit & {
    tags: (SnipitTag & {
      tag: Tag;
    })[];
    interactions: SnipitInteractions[];
    creator: User;
  };
  onChecked?: () => void;
};

function SnipitCard({ snipit, onChecked }: SnipitCardProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const updateNumFollowsMutation = api.snipit.updateNumFollows.useMutation();
  const updateNumCheckedMutation = api.snipit.updateNumChecked.useMutation();

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
      onChecked?.();
    } catch (error) {
      console.error("Error updating numChecked", error);
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border md:w-[365px]">
      <UserAvatar
        user={snipit.creator}
        className="mb-6 bg-sky-600 p-4 text-white"
      />
      <div className="p-6">
        <div className="mb-4">{snipit.prompt}</div>
        {snipit.tags.map((tag) => (
          <span key={tag.tag.id} className="mr-2 text-sm text-gray-500">
            #{tag.tag.name}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2">
        <button
          onClick={handleCheck}
          className="box-border w-full rounded-bl-xl border-2 border-red-500 p-2"
        >
          <AiOutlineCloseCircle className="mx-auto text-4xl text-red-500" />
        </button>
        <button
          onClick={handleCheck}
          className="w-full rounded-br-xl bg-green-500 p-2"
        >
          <AiOutlineCheckCircle className="mx-auto text-4xl text-white" />
        </button>
      </div>
    </div>
  );
}

export default SnipitCard;
