import Head from "next/head";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabaseClient";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
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

  const addNewLink = async () => {
    try {
      if (title && url && userId) {
      }
      const { data, error } = await supabase
        .from("links")
        .insert({
          title: title,
          url: url,
          user_id: userId,
        })
        .select();
      if (error) throw error;
      console.log("data: ", data);
    } catch (error) {
      console.log("error: ", error);
    }
  };
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
        <section>
          <h1>Sup Mfers!!</h1>
          {isAuthenticated && (
            <>
              <label htmlFor="email">Title</label>
              <div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="my alpha link"
                />
              </div>
              <label htmlFor="email">URL</label>
              <div>
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  placeholder="https://twitter.com/creatine_cycle"
                />
              </div>
              <button type="button" onClick={addNewLink}>
                Add new link
              </button>
            </>
          )}
        </section>
      </main>
    </>
  );
}
