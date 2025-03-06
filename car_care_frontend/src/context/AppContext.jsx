import { createContext } from "react";
//import { Centers } from "../assets/assets";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [Centers, setCenters] = useState([]);

  //user auth token in state variable
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );

    const getCentersData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/service-center/list");

      if (data.success) {
        setCenters(data.Centers);
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



  const value = {
    Centers,
    currencySymbol,
    token,
    setToken,
    backendUrl,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
