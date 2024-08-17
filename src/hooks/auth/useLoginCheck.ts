import { useState, useEffect } from "react";
import Constants from "../../services/Constants";

export function useLoginCheck() {
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoggedIn(false);
        setCheckingLogin(false);
        return;
      }

      try {
        const result = await fetch(`${Constants.backendUrl}/api/v2/app`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (result.status === 401) {
          setIsLoggedIn(false);
        } else {
          const data = await result.json();
          setIsLoggedIn(data.allowed);
        }
      } catch (error) {
        console.error("Login check failed", error);
        setIsLoggedIn(false);
      } finally {
        setCheckingLogin(false);
      }
    };

    checkLogin();
  }, []);

  return { checkingLogin, isLoggedIn, setIsLoggedIn };
}