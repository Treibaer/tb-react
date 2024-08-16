import { useState } from "react";
import Constants from "../services/Constants";

export default function LoginView({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const response = await fetch(`${Constants.backendUrl}/api/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        client: "tb-react",
      }),
    });
    const data = await response.json();
    
    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
    } else {
      setError("Invalid credentials");
      setIsSubmitting(false);
    }
  }
  return (
    <div>
      <h1>Login</h1>
      <form>
        <input
          type="text"
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <button onClick={handleLogin} disabled={isSubmitting ? "disabled": undefined}>Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
