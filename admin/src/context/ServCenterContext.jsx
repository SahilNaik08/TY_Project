import { createContext } from "react";

export const ServCenterContext = createContext();

const ServCenterContextProvider = (props) => {
  const value = {};

  return (
    <ServCenterContext.Provider value={value}>
      {props.children}
    </ServCenterContext.Provider>
  );
};

export default ServCenterContextProvider;
