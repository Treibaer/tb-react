import {
  ChartBarIcon,
  ChartPieIcon,
  CreditCardIcon,
  DocumentTextIcon,
  HomeIcon,
  LockClosedIcon,
  SignalIcon,
  TagIcon,
  TicketIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ROUTES } from "../../routes";
import Constants from "../../services/Constants";
import NavigationLink from "./NavigationLink";
import UserMenu from "./UserMenu";

export default function MainNavigation() {
  const avatar = useSelector((state: any) => state.ui.avatar);

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
      {showSettings && <UserMenu onClose={toggleSettings} />}
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
          icon={<HomeIcon />}
        />
        <NavigationLink
          to={ROUTES.PROJECTS}
          title="Projects"
          icon={<ChartBarIcon />}
        />
        {!Constants.isDemoMode && (
          <>
            <NavigationLink
              to={ROUTES.TICKETS_BOARD_VIEW("HK")}
              title="Board View"
              icon={<TagIcon />}
            />
            <NavigationLink
              to={ROUTES.STATUS}
              title="Status"
              icon={<SignalIcon />}
            />
            <NavigationLink
              to={ROUTES.FINANCE_DASHBOARD}
              title="Finances"
              icon={<CreditCardIcon />}
            />
            <NavigationLink
              to={ROUTES.PASSWORDS_ENTRIES(1)}
              title="Passwords"
              icon={<LockClosedIcon />}
            />
          </>
        )}
        {params.projectSlug && (
          <>
            <hr className="py-2" />
            <NavigationLink
              to={ROUTES.PROJECT_DETAILS(params.projectSlug)}
              title="Project Overview"
              icon={<HomeIcon />}
            />
            <NavigationLink
              to={ROUTES.TICKETS_BOARD_VIEW(params.projectSlug)}
              title="Board View"
              icon={<TagIcon />}
            />
            <NavigationLink
              to={ROUTES.PROJECTS_PAGES(params.projectSlug)}
              title="Pages"
              icon={<DocumentTextIcon />}
            />
            <NavigationLink
              to={ROUTES.BOARDS(params.projectSlug)}
              title="Boards"
              icon={<ChartPieIcon />}
            />
            <NavigationLink
              to={ROUTES.TICKETS_LIST(params.projectSlug)}
              title="All Tickets"
              icon={<TicketIcon />}
            />
          </>
        )}
        {isFinancePage && (
          <>
            <hr className="py-2" />
            <NavigationLink
              to={ROUTES.FINANCE_DASHBOARD}
              title="Dashboard"
              icon={<CreditCardIcon />}
            />
            <NavigationLink
              to={ROUTES.FINANCE_DETAILS}
              title="Details"
              icon={<ChartPieIcon />}
            />
            <NavigationLink
              to={ROUTES.FINANCE_SUMMARY}
              title="Summary"
              icon={<ChartBarIcon />}
            />
          </>
        )}
      </nav>
    </header>
  );
}
