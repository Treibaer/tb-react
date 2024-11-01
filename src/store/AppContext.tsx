import { createContext, useReducer } from "react";

type AppContextType = {
  isLoggedIn: boolean;
  userIcon: string;
  setUserIcon: (userIcon: string) => void;
};

const AppContext = createContext<AppContextType>({
  isLoggedIn: false,
  userIcon: "",
  setUserIcon: () => {},
});

function appReducer(
  state: AppContextType,
  action: {
    type: "LOGIN" | "LOGOUT" | "SET_USER_ICON";
    payload: any;
  }
) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isLoggedIn: true };
    case "LOGOUT":
      return { ...state, isLoggedIn: false };
    case "SET_USER_ICON":
      return { ...state, userIcon: action.payload };
    default:
      return state;
  }
}

export function AppContextProvider({ children }: any) {
  const [state, _dispatch] = useReducer(appReducer, {
    isLoggedIn: false,
    userIcon: "",
    setUserIcon: () => {},
  });

  function setUserIcon(userIcon: String) {
    _dispatch({ type: "SET_USER_ICON", payload: userIcon });
  }

  const value = {
    isLoggedIn: state.isLoggedIn,
    userIcon: state.userIcon,
    setUserIcon,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContext;
