import { useRouter } from "next/router";
import { useState } from "react";
import supabase from "../../utils/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function signInWithEmail() {
    try {
      const res = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (res.error) throw res.error;
      const userId = res.data.user?.id;
      console.log("userId: ", userId);
      router.push("/");
    } catch {
      console.log("there is an error");
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
          autoComplete="username"
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
          autoComplete="current-password"
        />

        <button type="button" onClick={signInWithEmail}>
          Login
        </button>
      </form>
    </section>
  );
};

export default Login;
