import { useEffect, useState } from "react";
import FullscreenLoadingSpinner from "./FullscreenLoadingSpinner";
import "./LoadingSpinner.css";

export const DelayedLoadingSpinner = () => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return showSpinner ? <FullscreenLoadingSpinner /> : null;
};

export default DelayedLoadingSpinner;
