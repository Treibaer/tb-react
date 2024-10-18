import { Outlet, useNavigation } from "react-router-dom";
import DelayedLoadingSpinner from "../components/common/DelayedLoadingSpinner";
import MainNavigation from "../components/Navigation/MainNavigation";
import MobileNavigation from "../components/Navigation/MobileNavigation";
import { useLoginCheck } from "../hooks/auth/useLoginCheck";
import Constants from "../services/Constants";
import LoginView from "./LoginView";
import AppContext from "../store/AppContext";
import { useContext, useEffect } from "react";

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
            <div className="w-full max-h-screen overflow-scroll h-[calc(100vh-58px)] md:h-full">
              <Outlet />
            </div>
            {!Constants.isDemoMode && (
              <div className="h-[58px] pb-2 md:hidden border-t border-t-lightBlue text-white text-center flex">
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
