import { createContext } from "react";
import { Centers } from "../assets/assets";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [centers, setCenters] = useState([]);

  const value = {
    Centers,
    currencySymbol,
  };

  {
    /*
    const getCentersData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/service-center/list");

      if (data.success) {
        setCenters(data.centers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getCentersData();
  }, []);

  */
  }

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
