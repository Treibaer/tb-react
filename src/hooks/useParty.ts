import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../store/ui-slice";

const useParty = () => {
  const dispatch = useDispatch();
  const isParty = useSelector((state: any) => state.ui.party);

  function startParty() {
    dispatch(uiActions.startParty());
    setTimeout(() => {
      dispatch(uiActions.stopParty());
    }, 3000);
  }
  return {
    party: "🎉",
    startParty,
    isParty,
  };
};

export default useParty;
