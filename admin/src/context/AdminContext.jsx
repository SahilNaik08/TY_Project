import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );

  const [centers, setCenters] = useState([]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllServCenters = async () => {
    console.log("Fetching Service Centers...");

    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-service-centers",
        {},
        { headers: { aToken } }
      );

      if (data.success) {
        setCenters(data.centers);
        //console.log("Centers Data:", data.centers);
        console.log("Is Array:", Array.isArray(data.centers));
        console.log(data.centers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailability = async (scId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { scId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllServCenters();
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    centers,
    getAllServCenters,
    changeAvailability,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
