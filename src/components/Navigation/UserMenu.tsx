import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div
      ref={dropdownRef}
      className="tb-container active tb-transparent-menu tb-context-menu show absolute right-2 pt-1 top-12 w-[140px]"
    >
      <NavLink className="tb-dropdown-item" to="/settings">
        Settings
      </NavLink>
      <NavLink className="tb-dropdown-item" to="/logout">
        Logout
      </NavLink>
    </div>
  );
};

export default UserMenu;
