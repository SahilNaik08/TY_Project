import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );

  const [centers, setCenters] = useState([]);

  const [bookings, setBookings] = useState([]);

  const [dashData, setDashData] = useState(false);

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

  const changeAvailability = async (service_center_email) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { service_center_email },
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

  //get all bookings
  const getAllBookings = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/bookings", {
        headers: { aToken },
      });

      //console.log('data : ', data);

      if (data.success) {
        setBookings(data.bookings);
        console.log(data.bookings);
      } else {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  //func to cancel booking using api
  const cancelBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-booking",
        { bookingId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllBookings(); //to get updated booking list
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  //dash data from backend
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });

      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
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
    bookings,
    setBookings,
    getAllBookings,
    cancelBooking,
    dashData,
    getDashData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
