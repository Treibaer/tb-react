import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaBorderAll, FaChartBar, FaChartPie, FaCoins, FaFile, FaImages, FaLock } from "react-icons/fa";
import { FaChartSimple, FaHouse, FaTicket } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../hooks/storeHoooks";
import { ROUTES } from "../../routes";
import Constants from "../../services/Constants";
import NavigationLink from "./NavigationLink";
import UserMenu from "./UserMenu";

export default function MainNavigation() {
  const avatar = useAppSelector((state) => state.ui.avatar);

  const params: { projectSlug?: string } = useParams();

  // check if current url starts with /finances
  const isFinancePage = window.location.pathname.startsWith(
    ROUTES.FINANCE_DASHBOARD
  );

  const [showSettings, setShowSettings] = useState<boolean>(false);

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  const backgroundColor =
    import.meta.env.MODE === "development" ? "bg-lightBlue" : "bg-darkBlue";

  // const appCtx = useContext(AppContext);

  return (
    <header
      className={`w-full h-screen ${backgroundColor} px-2 pt-2 border-x border-[#2c2d3c] relative`}
    >
      <AnimatePresence>
        {showSettings && <UserMenu onClose={toggleSettings} />}
      </AnimatePresence>
      <div className="flex justify-between mb-1 items-center">
        <div className="select-none">TB-REACT</div>
        <img
          id="profile"
          className="w-7 h-7 rounded-full cursor-pointer"
          src={avatar}
          alt=""
          onClick={toggleSettings}
        />
      </div>
      <nav className="flex flex-col w-full gap-1">
        <NavigationLink
          to={ROUTES.HOME}
          title="Dashboard"
          icon={<FaHouse />}
        />
        <NavigationLink
          to={ROUTES.PROJECTS}
          title="Projects"
          icon={<FaChartSimple />}
        />
        {!Constants.isDemoMode && (
          <>
            <NavigationLink
              to={ROUTES.TICKETS_BOARD_VIEW("HK")}
              title="Board View"
              icon={<FaTicket />}
            />
            <NavigationLink
              to={ROUTES.ASSETS}
              title="Assets"
              icon={<FaImages />}
            />
            <NavigationLink
              to={ROUTES.FINANCE_DASHBOARD}
              title="Finances"
              icon={<FaCoins />}
            />
            <NavigationLink
              to={ROUTES.PASSWORDS_ENTRIES(1)}
              title="Passwords"
              icon={<FaLock />}
            />
          </>
        )}
        {params.projectSlug && (
          <>
            <hr className="py-2" />
            <NavigationLink
              to={ROUTES.PROJECT_DETAILS(params.projectSlug)}
              title="Project Overview"
              icon={<FaHouse />}
            />
            <NavigationLink
              to={ROUTES.TICKETS_BOARD_VIEW(params.projectSlug)}
              title="Board View"
              icon={<FaTicket />}
            />
            <NavigationLink
              to={ROUTES.PROJECTS_PAGES(params.projectSlug)}
              title="Pages"
              icon={<FaFile />}
            />
            <NavigationLink
              to={ROUTES.BOARDS(params.projectSlug)}
              title="Boards"
              icon={<FaBorderAll />}
            />
            <NavigationLink
              to={ROUTES.TICKETS_LIST(params.projectSlug)}
              title="All Tickets"
              icon={<FaTicket />}
            />
          </>
        )}
        {isFinancePage && (
          <>
            <hr className="py-2" />
            <NavigationLink
              to={ROUTES.FINANCE_DASHBOARD}
              title="Dashboard"
              icon={<FaCoins />}
            />
            <NavigationLink
              to={ROUTES.FINANCE_DETAILS}
              title="Details"
              icon={<FaChartPie />}
            />
            <NavigationLink
              to={ROUTES.FINANCE_SUMMARY}
              title="Summary"
              icon={<FaChartBar />}
            />
          </>
        )}
      </nav>
    </header>
  );
}
