// components/AuthButton.tsx
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const AuthMenu: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return (
      <button onClick={() => signIn()} className="login-button">
        Login
      </button>
    );
  }

  const userAvatar = session?.user.image;
  const screenName = session?.user.name;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          {userAvatar ? (
            <AvatarImage src={userAvatar} />
          ) : (
            <AvatarFallback>{screenName?.charAt(0)}</AvatarFallback>
          )}
          <span>{screenName}</span>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Link href="/profile">
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthMenu;
