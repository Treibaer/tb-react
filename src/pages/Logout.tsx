import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  return <div>Logged out.</div>;
};

export default Logout;
