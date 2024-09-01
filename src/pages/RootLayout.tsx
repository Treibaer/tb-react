import { Outlet, useNavigation } from "react-router-dom";
import DelayedLoadingSpinner from "../components/common/DelayedLoadingSpinner";
import MainNavigation from "../components/Navigation/MainNavigation";
import { useLoginCheck } from "../hooks/auth/useLoginCheck";
import LoginView from "./LoginView";

export const RootLayout: React.FC = () => {
  const { state } = useNavigation();
  const { checkingLogin, isLoggedIn, setIsLoggedIn, serverError } = useLoginCheck();

  return (
    <>
      {state === "loading" && <DelayedLoadingSpinner />}
      {serverError && <div className="text-red-500">Server error. Please try again later.</div>}
      {isLoggedIn && (
        <main className="flex">
          <div className="hidden md:block w-[250px]">
            <MainNavigation />
          </div>
          <div className="w-full md:w-[calc(100%-250px)] max-h-screen overflow-scroll">
            <Outlet />
          </div>
        </main>
      )}
      {!serverError && !isLoggedIn && !checkingLogin && (
        <LoginView setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
};

export default RootLayout;
