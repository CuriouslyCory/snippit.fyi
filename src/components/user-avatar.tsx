import { type User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "~/lib/utils";

export const UserAvatar = ({
  user,
  className,
}: {
  user: User;
  className?: string;
}): JSX.Element => {
  return (
    <section className={cn("flex items-center gap-x-3", className)}>
      <Avatar className="h-8 w-8">
        {user?.image ? (
          <AvatarImage src={user.image} />
        ) : (
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        )}
      </Avatar>
      <span className="font-semibold">{user?.name}</span>
    </section>
  );
};
