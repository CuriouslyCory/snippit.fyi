import { type NextPage } from "next";
import Head from "next/head";
import { CreateSnipit } from "~/features/snipit/create-snipit";
import { RandomSnipit } from "~/features/snipit/random-snipit";

const Home: NextPage = () => {
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
      <section className="flex items-center justify-center">
        <RandomSnipit />
        <CreateSnipit />
      </section>
    </>
  );
};

export default Home;
