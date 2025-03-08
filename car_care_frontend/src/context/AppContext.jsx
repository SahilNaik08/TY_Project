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

  //user profile
  const [userData, setUserData] = useState(false)

  //user auth token in state variable
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );

  //api function to get centers from backend
  const getCentersData = async () => {
     try {
            const data  = await axios.get(backendUrl + "/api/service-center/list");
      
            if (data) {
              console.log('this is the main ', data.data.results)
              setCenters(data.data.results);
            } else {
              console.log('else ')
              toast.error(data.message);
            }
          } catch (error) {
            console.log(error);
            toast.error(error.message);
          }
  };

  // Getting User Profile using API
  const loadUserProfileData = async () => {

    try {

        const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })

        if (data.success) {
            setUserData(data.userData)
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }

}

  useEffect(() => {
    getCentersData();
  }, []);

  //useEffect for profile
  useEffect(() => {
    if (token) {
        loadUserProfileData();
    } else {
      setUserData(false);
    }
}, [token])


  const value = {
    Centers,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData, 
    setUserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
