import React, { useCallback, useEffect, useState } from "react";
import { api } from "~/utils/api";
import SnipitCard from "./snipit-card";
import Image from "next/image";

export type RandomSnipitQuery = {
  public: boolean;
  not?: number;
};

// Primary snipit display component. Gets "random" snipit from the database.
export const RandomSnipit = () => {
  const [query, setQuery] = useState<RandomSnipitQuery>({
    public: true,
  });
  const getRandomSnipitQuery = api.snipit.getRandomSnipit.useQuery(query, {
    cacheTime: 1,
  });
  const [snipit, setSnipit] = useState<typeof getRandomSnipitQuery.data | null>(
    null
  );

  // triggered when a user clicks any action on a snipit card.
  const fetchNextSnipit = useCallback(() => {
    setQuery({ ...query, not: snipit?.id });
  }, [query, snipit?.id]);

  // setting this here instead of in the callback because it of an issue with setting state while rendering another component
  useEffect(() => {
    if (getRandomSnipitQuery.data) {
      setSnipit(getRandomSnipitQuery?.data);
    }
  }, [getRandomSnipitQuery.data]);

  if (getRandomSnipitQuery.error) {
    return <div>Error: {getRandomSnipitQuery.error.message}</div>;
  }

  // todo: move the loader into a component that can be triggered globally through a hook like "useToast"
  return (
    <div className="m-5 md:m-0">
      {getRandomSnipitQuery.isLoading && (
        <div className="absolute left-0 top-0 flex h-screen w-screen items-center justify-center bg-slate-400/20">
          <div className="h-20 w-20 animate-spin">
            <Image src="/images/logo.svg" alt="Illustration of scissors" fill />
          </div>
        </div>
      )}
      {snipit && <SnipitCard snipit={snipit} onAction={fetchNextSnipit} />}
    </div>
  );
};
