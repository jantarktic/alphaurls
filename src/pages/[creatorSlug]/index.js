import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import ImageUploading from "react-images-uploading";
import supabase from "../../../utils/supabaseClient";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState();
  const [images, setImages] = useState([]);
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const router = useRouter();
  const { creatorSlug } = router.query;

  const onChange = (imageList) => {
    setImages(imageList);
  };

  useEffect(() => {
    const getUser = async () => {
      const user = await supabase.auth.getUser();
      console.log("user", user);
      if (user.data.user) {
        const userId = user.data.user?.id;
        setIsAuthenticated(true);
        setUserId(userId);
      }
    };

    getUser();
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, profile_picture_url")
          .eq("username", creatorSlug);
        if (error) throw error;
        const profilePictureUrl = data[0]["profile_picture_url"];
        const userId = data[0]["id"];
        setProfilePictureUrl(profilePictureUrl);
        setUserId(userId);
      } catch (error) {
        console.log("error: ", error);
      }
    };

    if (creatorSlug) {
      getUser();
    }
  }, [creatorSlug]);

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
  const uploadProfilePicture = async () => {
    try {
      if (images.length > 0) {
        const image = images[0];
        if (image.file && userId) {
          const { data, error } = await supabase.storage
            .from("public")
            .upload(`${userId}/${image.file.name}`, image.file, {
              upsert: true,
            });
          if (error) throw error;
          const res = supabase.storage.from("public").getPublicUrl(data.path);
          const publicUrl = res.data.publicUrl;
          const updateUserResponse = await supabase
            .from("users")
            .update({ profile_picture_url: publicUrl })
            .eq("id", userId);
          if (updateUserResponse.error) throw error;
        }
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  async function signOut() {
    try {
      console.log("Attempting to sign out"); // Add this line

      const { error } = await supabase.auth.signOut();

      if (error) throw error;
      console.log("Logged out successfully");
      setIsAuthenticated(false); // Add this line
      setUserId(""); // Add this line
      // Navigate to the desired page after logout, for example:
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }

  return (
    <>
      <main>
        <section>
          {profilePictureUrl && (
            <Image
              src={profilePictureUrl}
              alt="profile-picture"
              height={100}
              width={100}
            />
          )}
          <h1> New Links added</h1>
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
              <div>
                <h1> Image Uploading</h1>
                {images.length > 0 && (
                  <Image
                    src={images[0]["data_url"]}
                    height={100}
                    width={100}
                    alt={"profile picture"}
                  />
                )}
                <ImageUploading
                  multiple
                  value={images}
                  onChange={onChange}
                  maxNumber={1}
                  dataURLKey="data_url"
                >
                  {({
                    onImageUpload,
                    onImageRemoveAll,
                    isDragging,
                    dragProps,
                  }) => (
                    <div>
                      {images.length === 0 ? (
                        <button
                          style={isDragging ? { color: "red" } : undefined}
                          onClick={onImageUpload}
                          {...dragProps}
                        >
                          Click to upload a new image or drag and drop a new
                          image here
                        </button>
                      ) : (
                        <button onClick={onImageRemoveAll}>
                          Remove all images
                        </button>
                      )}
                    </div>
                  )}
                </ImageUploading>
                <button type="button" onClick={uploadProfilePicture}>
                  Upload Profile Picture
                </button>
              </div>
              <button type="button" onClick={signOut}>
                Logout
              </button>
            </>
          )}
        </section>
      </main>
    </>
  );
}
