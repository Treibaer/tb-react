import { useRef } from "react";
import { useDispatch } from "react-redux";
import { uiActions } from "../store/ui-slice";
import { useAppSelector } from "./storeHoooks";

const useParty = () => {
  const dispatch = useDispatch();
  const isParty = useAppSelector((state) => state.ui.party);
  const timer = useRef<NodeJS.Timeout | null>(null);

  async function startParty() {
    if (timer.current) {
      clearTimeout(timer.current);
      dispatch(uiActions.stopParty());
      // wait 100ms to allow the party to stop
      await new Promise((resolve) => setTimeout(resolve, 1));
    }
    dispatch(uiActions.startParty());
    const newTimer = setTimeout(() => {
      dispatch(uiActions.stopParty());
    }, 4000);
    timer.current = newTimer;
  }
  return {
    party: "🎉",
    startParty,
    isParty,
  };
};

export default useParty;
