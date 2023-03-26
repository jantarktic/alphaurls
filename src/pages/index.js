import Head from "next/head";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabaseClient";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      console.log("user", user);
      if (user) {
        const userId = user.data.user?.id;
        setIsAuthenticated(true);
        setUserId(userId);
      }
    };

    getUser();
  }, []);
  return (
    <>
      <Head>
        <title>Alphaurls</title>
        <meta
          name="description"
          content="An alpha way to display your links in your bio. No styling. No Nonsense."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <h1>Sup Mfers!!</h1>
        </div>
      </main>
    </>
  );
}
