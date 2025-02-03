import { useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useNavigation } from "react-router-dom";
import DelayedLoadingSpinner from "../components/common/DelayedLoadingSpinner";
import MainNavigation from "../components/Navigation/MainNavigation";
import MobileNavigation from "../components/Navigation/MobileNavigation";
import { useLoginCheck } from "../hooks/auth/useLoginCheck";
import Constants from "../services/Constants";
import AppContext from "../store/AppContext";
import LoginView from "./LoginView";
import PartyComponent from "./projects/PartyComponent";

export const RootLayout: React.FC = () => {
  const { state } = useNavigation();
  const {
    checkingLogin,
    isLoggedIn,
    setIsLoggedIn,
    serverError,
    avatar,
    checkLogin,
  } = useLoginCheck();

  const appCtx = useContext(AppContext);

  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    appCtx.setUserIcon(avatar);
  }, [isLoggedIn]);

  return (
    <>
      {state === "loading" && <DelayedLoadingSpinner />}
      <PartyComponent />
      <div data-cy="toaster-wrapper">
        <Toaster />
      </div>
      {serverError && (
        <div className="text-red-500">
          Server error. Please try again later.
        </div>
      )}
      {isLoggedIn && (
        <main className="flex h-[100dvh] w-[100dvw] md:w-auto">
          <div id="menu" className="hidden md:block w-[250px]">
            <MainNavigation />
          </div>
          <div className="flex flex-col w-full md:w-[calc(100%-250px)] justify-between h-full">
            <div className="w-full flex-1 h-full overflow-y-scroll overflow-x-scroll md:h-full">
              <Outlet />
            </div>
            {!Constants.isDemoMode && (
              <div className="h-[74px] md:hidden border-t border-t-border text-white text-center flex bg-border pb-4">
                <MobileNavigation />
              </div>
            )}
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
