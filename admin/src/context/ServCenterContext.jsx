import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const ServCenterContext = createContext();

const ServCenterContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [scToken, setScToken] = useState(
    localStorage.getItem("scToken") ? localStorage.getItem("scToken") : ""
  );

  const [bookings, setBookings] = useState([]);

  const [dashData, setDashData] = useState(false);

  //get bookings using api
  const getBookings = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/service-center/bookings",
        { headers: { scToken } }
      );

      if (data.success) {
        setBookings(data.bookings);
        //console.log(data.bookings.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  //api to mark booking as completed
  const completeBooking = async (booking_id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/service-center/complete-booking",
        { booking_id },
        { headers: { scToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getBookings();
        // Later after creating getDashData Function
        getDashData()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  //api to cancel booking
  const cancelBooking = async (booking_id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/service-center/cancel-booking",
        { booking_id },
        { headers: { scToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getBookings();
        // Later after creating getDashData Function
        getDashData()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  //api func to get dash data
  const getDashData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/service-center/dashboard",
        { headers: { scToken } }
      );

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
    scToken,
    setScToken,
    backendUrl,
    bookings,
    setBookings,
    getBookings,
    completeBooking,
    cancelBooking,
    dashData,
    setDashData,
    getDashData,
  };

  return (
    <ServCenterContext.Provider value={value}>
      {props.children}
    </ServCenterContext.Provider>
  );
};

export default ServCenterContextProvider;
