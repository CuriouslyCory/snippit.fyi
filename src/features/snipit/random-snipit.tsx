import React, { useCallback, useEffect, useState } from "react";
import { api } from "~/utils/api";
import SnipitCard from "./snipit-card";
import {
  type SnipitTag,
  type Snipit,
  type Tag,
  type SnipitInteractions,
  type User,
} from "@prisma/client";

export type RandomSnipitQuery = {
  public: boolean;
  not?: number;
};

export const RandomSnipit = () => {
  const [snipit, setSnipit] = useState<
    | (Snipit & {
        interactions: SnipitInteractions[];
        tags: (SnipitTag & {
          tag: Tag;
        })[];
        creator: User;
      })
    | null
  >(null);
  const [query, setQuery] = useState<RandomSnipitQuery>({
    public: true,
  });
  const getRandomSnipitQuery = api.snipit.getRandomSnipit.useQuery(query);

  const fetchNextSnipit = useCallback(() => {
    console.log("Updating random query");
    setQuery({ ...query, not: snipit?.id });
  }, [query, snipit?.id]);

  useEffect(() => console.log(query), [query]);

  useEffect(() => {
    if (getRandomSnipitQuery.data) {
      setSnipit(getRandomSnipitQuery?.data);
    }
  }, [getRandomSnipitQuery.data]);

  if (getRandomSnipitQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (getRandomSnipitQuery.error) {
    return <div>Error: {getRandomSnipitQuery.error.message}</div>;
  }

  return (
    <div>
      {snipit && (
        <SnipitCard
          snipit={snipit}
          onAction={fetchNextSnipit}
          key={snipit.id}
        />
      )}
    </div>
  );
};
