import {
  type SnipitTag,
  type Snipit,
  type Tag,
  type SnipitInteractions,
  type User,
} from "@prisma/client";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
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
  const updateNumCheckedMutation = api.snipit.updateNumChecked.useMutation();
  const [test, setTest] = useState(false);

  const handleCheck = async () => {
    setTest((tval) => !tval);
    try {
      await updateNumCheckedMutation.mutateAsync({ snipitId: snipit.id });
      onChecked?.();
    } catch (error) {
      console.error("Error updating numChecked", error);
    }
  };

  return (
    <div className="w-full overflow-hidden  shadow-md md:w-[365px]">
      <UserAvatar user={snipit.creator} className="mb-4 p-4 text-slate-600" />
      <div className="p-6">
        <div className="mb-4">{snipit.prompt}</div>
        {snipit.tags.map((tag) => (
          <span key={tag.tag.id} className="mr-2 text-sm text-gray-500">
            #{tag.tag.name}
          </span>
        ))}
      </div>
      <div className="grid h-14 grid-cols-2">
        <button onClick={handleCheck} className="box-border w-full p-2">
          <AiOutlineCloseCircle className="mx-auto text-4xl text-red-400" />
        </button>
        <button onClick={handleCheck} className="w-full overflow-hidden p-2">
          <div className="relative">
            <AiOutlineCheckCircle
              className={clsx(
                "mx-auto  text-4xl text-green-500 transition-transform duration-300 ease-bounce",
                { "translate-y-16": test }
              )}
            />
            <span
              className={clsx(
                "mx-auto block w-fit  text-4xl text-green-500 transition-transform duration-300 ease-bounce",
                { "-translate-y-10": test },
                { "translate-y-2": !test }
              )}
            >
              12
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default SnipitCard;
