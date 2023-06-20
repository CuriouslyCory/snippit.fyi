import { useSession } from "next-auth/react";
import { FeedTypeSelect } from "~/components/feed-type-select";
import AuthMenu from "../auth-menu";

export const LeftMenu = (): JSX.Element => {
  const { data: sessionData } = useSession();
  return (
    <>
      {!!sessionData && <FeedTypeSelect />}
      {!sessionData && (
        <div className="w-36">
          <AuthMenu />
        </div>
      )}
    </>
  );
};

export default LeftMenu;
