import { useEffect, useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import MainNavigation from "../components/Navigation/MainNavigation";
import LoginView from "./LoginView";
import { useLoginCheck } from "../hooks/auth/useLoginCheck";

export default function RootLayout() {
  const navigation = useNavigation();
  const { checkingLogin, isLoggedIn, setIsLoggedIn } = useLoginCheck();
  
  return (
    <>
      {navigation.state === "loading" && <DelayedLoadingSpinner />}
      {isLoggedIn && (
        <>
          <MainNavigation />
          <main className="container">
            <Outlet />
          </main>
        </>
      )}
      {!isLoggedIn && !checkingLogin && (
        <LoginView setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
}

function DelayedLoadingSpinner() {
  const [isWaiting, setIsWaiting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsWaiting(false);
    }, 300);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  if (isWaiting) return null;

  return <LoadingSpinner />;
}
