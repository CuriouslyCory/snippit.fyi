import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { CreateSnipit } from "~/features/snipit/create-snipit";
import { RandomSnipit } from "~/features/snipit/random-snipit";

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
      <section className="flex h-full flex-col items-center justify-center gap-y-5">
        <RandomSnipit />
        {!!sessionData && <CreateSnipit />}
      </section>
    </>
  );
};

export default Home;
