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
import { useToast } from "~/hooks/use-toast";
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
  onSkipped?: () => void;
  onAction?: () => void;
};

function SnipitCard({
  snipit,
  onChecked,
  onSkipped,
  onAction,
}: SnipitCardProps) {
  const { toast } = useToast();
  const checkMutation = api.snipit.check.useMutation();
  const skipMutation = api.snipit.skip.useMutation();

  // Set to true when user clicks check button
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(false);
  }, [snipit.id]);

  /**
   * Handle the check button click
   */
  const handleCheck = async () => {
    setChecked((tval) => !tval);
    try {
      await checkMutation.mutateAsync({ snipitId: snipit.id });
      onChecked?.();
      onAction?.();
    } catch (error) {
      toast({ title: "Error updating numChecked", variant: "destructive" });
      console.error("Error updating numChecked", error);
    }
  };

  /**
   * Handle the skip button click
   */
  const handleSkip = async () => {
    try {
      await skipMutation.mutateAsync({ snipitId: snipit.id });
      onSkipped?.();
      onAction?.();
    } catch (error) {
      toast({ title: "Error updating numChecked", variant: "destructive" });
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
      <div className="grid grid-cols-2">
        <button
          onClick={handleSkip}
          className="box-border w-full p-2"
          disabled={checked}
        >
          <AiOutlineCloseCircle className="mx-auto text-4xl text-red-400" />
        </button>
        <button
          onClick={handleCheck}
          className="h-12 w-full overflow-hidden p-2"
          disabled={checked}
        >
          <div className="relative">
            <AiOutlineCheckCircle
              className={clsx(
                "mx-auto  text-4xl text-green-500 transition-all duration-300 ease-bounce",
                { "translate-y-16 opacity-0": checked }
              )}
            />
            <span
              className={clsx(
                "mx-auto block w-fit  text-3xl text-green-500 transition-all duration-300 ease-bounce",
                { "-translate-y-9": checked },
                { "translate-y-2 opacity-0": !checked }
              )}
            >
              {snipit.interactions.length > 0 &&
                snipit.interactions[0]?.numChecked}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default SnipitCard;
