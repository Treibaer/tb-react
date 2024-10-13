import { useState } from "react";
import Constants from "../../services/Constants";
import { AccessToken } from "../../models/access-token";

export function useLogin(setIsLoggedIn: (isLoggedIn: boolean) => void) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${Constants.backendUrl}/api/v3/login`, {
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

      const data: AccessToken = await response.json();

      if (response.ok && data.value) {
        localStorage.setItem("token", data.value);
        setIsLoggedIn(true);
      } else {
        setError("Invalid credentials");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setError("An error occurred. Please try again." + err.message);
      setIsSubmitting(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isSubmitting,
    handleLogin,
  };
}
