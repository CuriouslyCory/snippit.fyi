import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import SnipitCard from "./snipit-card";
import { SnipitTag, type Snipit, Tag } from "@prisma/client";

export const RandomSnipit = () => {
  const [snipit, setSnipit] = useState<
    | (Snipit & {
        tags: (SnipitTag & {
          tag: Tag;
        })[];
      })
    | null
  >(null);
  const getRandomSnipitQuery = api.snipit.getRandomSnipit.useQuery({
    public: true,
  });

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

  return <div>{snipit && <SnipitCard snipit={snipit} />}</div>;
};
