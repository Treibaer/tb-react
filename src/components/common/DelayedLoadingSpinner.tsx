import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import "./LoadingSpinner.css";

export const DelayedLoadingSpinner = () => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(true), 300);

    return () => clearTimeout(timer);
  }, []);

  return showSpinner ? <LoadingSpinner /> : null;
};

export default DelayedLoadingSpinner;
