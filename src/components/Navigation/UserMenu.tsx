import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { FaLocationArrow, FaLock, FaSignal } from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";
import { NavLink, useLocation } from "react-router-dom";
import { ROUTES } from "../../routes";
import Constants from "../../services/Constants";

export const UserMenu: React.FC<{ onClose: Function }> = ({ onClose }) => {
  const location = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    onClose();
  }, [location, onClose]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !event.composedPath().includes(document.getElementById("profile")!)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      exit={{ opacity: 0 }}
      ref={dropdownRef}
      className="tb-transparent-menu absolute right-2 pt-1 top-12 w-[140px]"
    >
      <NavLink className="tb-dropdown-item" to={ROUTES.SETTINGS}>
        <div className="flex items-center">
          <FaSliders className="h-4 w-4 mr-2" />
          <div>Settings</div>
        </div>
      </NavLink>

      {!Constants.isDemoMode && (
        <NavLink className="tb-dropdown-item" to={ROUTES.STATUS}>
          <div className="flex items-center">
            <FaSignal className="h-4 w-4 mr-2" />
            <div>Status</div>
          </div>
        </NavLink>
      )}

      <NavLink className="tb-dropdown-item" to={ROUTES.CHANGELOG}>
        <div className="flex items-center">
          <FaLocationArrow className="h-4 w-4 mr-2" />
          <div>Changelog</div>
        </div>
      </NavLink>

      <NavLink className="tb-dropdown-item" to={ROUTES.LOGOUT}>
        <div className="flex items-center">
          <FaLock className="h-4 w-4 mr-2" />
          <div>Logout</div>
        </div>
      </NavLink>
    </motion.div>
  );
};

export default UserMenu;
