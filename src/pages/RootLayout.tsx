import { Outlet, useNavigation } from "react-router-dom";
import DelayedLoadingSpinner from "../components/common/DelayedLoadingSpinner";
import MainNavigation from "../components/Navigation/MainNavigation";
import { useLoginCheck } from "../hooks/auth/useLoginCheck";
import LoginView from "./LoginView";

export const RootLayout: React.FC = () => {
  const { state } = useNavigation();
  const { checkingLogin, isLoggedIn, setIsLoggedIn } = useLoginCheck();

  return (
    <>
      {state === "loading" && <DelayedLoadingSpinner />}
      {isLoggedIn && (
        <>
          <main className="flex">
            <div className="w-[250px] fixed ">
              <MainNavigation />
            </div>
            <div className="w-[250px] bg-slate-700 px-2 pt-4"></div>
            <div className="w-[calc(100%-250px)]">
              <Outlet />
            </div>
          </main>
        </>
      )}
      {!isLoggedIn && !checkingLogin && (
        <LoginView setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
};

export default RootLayout;
