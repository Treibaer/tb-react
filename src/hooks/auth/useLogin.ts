import { useState } from "react";
import Constants from "../../services/Constants";
import { AccessToken } from "../../models/access-token";
import { useLoginCheck } from "./useLoginCheck";
import { showToast } from "../../utils/tbToast";

export function useLogin(setIsLoggedIn: (isLoggedIn: boolean) => void) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { checkLogin } = useLoginCheck();

  async function handleLogin() {
    setIsSubmitting(true);

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

      if (response.ok && data.accessToken) {
        localStorage.setItem("token", data.accessToken);
        setIsLoggedIn(true);
        checkLogin();
      } else {
        showToast("error", "", "Invalid email or password");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      showToast("error", "", err.message);
      setIsSubmitting(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    handleLogin,
  };
}
