import { FaCoins, FaLock } from "react-icons/fa";
import { FaSliders, FaTicket } from "react-icons/fa6";
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
        <FaTicket className="size-5" />
      </NavLink>
      <NavLink
        to={ROUTES.FINANCE_DETAILS}
        className="flex-1 flex justify-center items-center"
      >
        <FaCoins className="size-5" />
      </NavLink>
      <NavLink
        to={ROUTES.PASSWORDS_ENTRIES(1)}
        className="flex-1 flex justify-center items-center"
      >
        <FaLock className="size-5" />
      </NavLink>
      <NavLink
        to={ROUTES.SETTINGS}
        className="flex-1 flex justify-center items-center"
      >
        <FaSliders className="size-5" />
      </NavLink>
    </div>
  );
}
