import { createContext } from "react";
import { Centers } from "../assets/assets";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";

  const value = {
    Centers,
    currencySymbol,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
