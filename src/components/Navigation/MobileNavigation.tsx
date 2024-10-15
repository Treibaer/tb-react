import {
  ChartBarIcon,
  CogIcon,
  CreditCardIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../routes";

export default function MobileNavigation() {
  const backgroundColor =
    import.meta.env.MODE === "development" ? "bg-lightBlue" : undefined;

  return (
    <div className={`flex justify-between w-full ${backgroundColor}`}>
      <NavLink
        to={ROUTES.TICKETS_BOARD_VIEW("HK")}
        className="flex-1 flex justify-center items-center"
      >
        <ChartBarIcon className="h-6 w-6" />
      </NavLink>
      <NavLink
        to={ROUTES.FINANCE_DETAILS}
        className="flex-1 flex justify-center items-center"
      >
        <CreditCardIcon className="h-6 w-6" />
      </NavLink>
      <NavLink
        to={ROUTES.PASSWORDS_ENTRIES(1)}
        className="flex-1 flex justify-center items-center"
      >
        <LockClosedIcon className="h-6 w-6" />
      </NavLink>
      <NavLink
        to={ROUTES.SETTINGS}
        className="flex-1 flex justify-center items-center"
      >
        <CogIcon className="h-6 w-6" />
      </NavLink>
    </div>
  );
}
