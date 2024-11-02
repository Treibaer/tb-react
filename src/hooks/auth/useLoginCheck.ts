import { useState } from "react";
import { AppResponse } from "../../models/app-response";
import { uiActions } from "../../store/ui-slice";
import Constants from "../../services/Constants";
import { useAppDispatch } from "../storeHoooks";

export function useLoginCheck() {
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [avatar, setAvatar] = useState("");

  const dispatch = useAppDispatch();

  const checkLogin = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setCheckingLogin(false);
      return;
    }

    try {
      const result = await fetch(`${Constants.backendUrl}/api/v3/app`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (result.status === 401) {
        setIsLoggedIn(false);
      } else {
        const data: AppResponse = await result.json();
        setIsLoggedIn(data.allowed);
        setAvatar(data.icon);
        // dispatch(uiActions.setUserIcon(data.icon));
        dispatch(uiActions.setUserIcon(data.icon));
      }
    } catch (error) {
      setServerError(true);
      console.error("Login check failed", error);
      setIsLoggedIn(false);
    } finally {
      setCheckingLogin(false);
    }
  };

  return {
    checkingLogin,
    isLoggedIn,
    setIsLoggedIn,
    serverError,
    avatar,
    checkLogin,
  };
}
