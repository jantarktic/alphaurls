import Head from "next/head";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabaseClient";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState();

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

  useEffect(() => {
    const getLinks = async () => {
      try {
        const { data, error } = await supabase
          .from("links")
          .select("title, url")
          .eq("user_id", userId);

        if (error) throw error;

        setLinks(data);
      } catch (error) {
        console.log("error: ", error);
      }
    };
    if (userId) {
      getLinks();
    }
  }, [userId]);

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
      if (links) {
        setLinks([...data, ...links]);
      }
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
          {links?.map((link, index) => (
            <div
              key={index}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = link.url;
              }}
            >
              {link.title}
            </div>
          ))}
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
