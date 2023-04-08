import { useState } from "react";
import supabase from "../../utils/supabaseClient";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  async function signUpWithEmail() {
    try {
      const res = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (res.error) throw res.error;
      const userId = res.data.user?.id;
      await createUser(userId);
      console.log("userId: ", userId);
    } catch {
      console.log("there is an error");
    }
  }

  async function createUser(userId) {
    try {
      const { error } = await supabase
        .from("users")
        .insert({ id: userId, username: username });
      if (error) throw error;
    } catch (error) {
      console.log("error :", error);
    }
  }

  return (
    <section>
      <form>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
        />

        <label htmlFor="password">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength="8"
          required
          placeholder="basedname"
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength="8"
          required
          placeholder="********"
        />

        <button type="button" onClick={signUpWithEmail}>
          Sign Up
        </button>
      </form>
    </section>
  );
};

export default Signup;
