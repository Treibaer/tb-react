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
        <main className="flex">
          <div id="menu" className="hidden md:block w-[250px]">
            <MainNavigation />
          </div>
          <div className="flex flex-col h-full w-full md:w-[calc(100%-250px)]">
            <div className="w-full max-h-screen overflow-auto h-[calc(100vh-58px)] md:h-full">
              <Outlet />
            </div>
            {!Constants.isDemoMode && (
              <div className="h-[58px] pb-2 md:hidden border-t border-t-border text-white text-center flex">
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
