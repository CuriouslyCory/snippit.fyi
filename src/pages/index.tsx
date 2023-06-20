import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { FeedTypeSelect } from "~/components/feed-type-select";
import AuthMenu from "~/features/auth-menu";
import { CreateSnipit } from "~/features/snipit/create-snipit";
import { RandomSnipit } from "~/features/snipit/random-snipit";
import { type FeedTypes } from "~/types/feeds";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <Head>
        <title>Snipit</title>
        <meta
          name="description"
          content="Remeber the things you don't want to forget."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="privacy" content="OpenPD"></meta>
      </Head>
      <div className="mt-10 flex gap-x-10">
        <section className="ml-auto">
          {!!sessionData && (
            <FeedTypeSelect />
          )}
          {!sessionData && (
            <div className="w-36">
              <AuthMenu />
            </div>
          )}
        </section>
        <section className="flex h-full flex-col items-center justify-center gap-y-5">
          <RandomSnipit />
          {!!sessionData && <CreateSnipit />}
        </section>
        <section className="mr-auto">Right Menu</section>
      </div>
    </>
  );
};

export default Home;
