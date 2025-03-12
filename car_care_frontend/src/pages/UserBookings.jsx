import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserBookings = () => {
  const { backendUrl, token, getCentersData } = useContext(AppContext);

  const navigate = useNavigate();

  const handleReSchedule = (serviceCenterId) => {
    //console.log("Navigating to Service Center ID:", serviceCenterId);
    navigate(`/bookings/${serviceCenterId}`); // Redirect to the service center's bookings page
    window.scrollTo(0, 0);
  };

  //state variables to store bookings
  const [bookings, setBookings] = useState([]);

  //for date format
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  //getting bookings
  const getUserBookings = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/user-bookings", {
        headers: { token },
      });

      if (data.success) {
        //checking for cancelled and is complete
        //console.log("API Response:", data.bookings);

        setBookings(data.bookings.reverse()); // Reverse to show latest first
        console.log("bookings : ", data.bookings);
      } else {
        toast.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching bookings");
    }
  };

  useEffect(() => {
    if (token) {
      getUserBookings();
    }
  }, [token]);

  //cancel booking func
  const cancelBooking = async (bookingId) => {
    try {
      console.log("booking id : ", bookingId);

      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-booking",
        { bookingId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserBookings();
        getCentersData(); //to refresh slots
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error canceling booking");
    }
  };

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Bookings
      </p>

      <div className="">
        {bookings.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
          >
            <div>
              <img
                className="w-32 bg-indigo-50"
                src={`http://localhost:3000${item.serviceCenterData.imageUrl}`}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.serviceCenterData.service_center_name}
              </p>
              <p>{item.serviceType}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">
                {item.serviceCenterData.service_center_city}
              </p>
              <p className="text-xs">
                {item.serviceCenterData.service_center_state}
              </p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time :
                </span>{" "}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            <div></div>

            

            <div className="flex flex-col gap-2 justify-end">
              {/* If booking is completed, show only the "Completed" button */}
              {item.isCompleted === 1 ? (
                <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                  Completed
                </button>
              ) : (
                <>
                  {/* Re-Schedule button (only if not cancelled and not completed) */}
                  
                  {item.cancelled === 0 && (
                    <button
                      onClick={() => 
                        handleReSchedule(item.serviceCenterData.sc_id)
                      }
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      Re-Schedule
                    </button>
                  )}

                  {/* Cancel booking button (only if not cancelled and not completed) */}
                  {item.cancelled === 0 && (
                    <button
                      onClick={() => cancelBooking(item.bookingId)}
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Cancel booking
                    </button>
                  )}

                  {/* Booking cancelled message (only if cancelled) */}
                  {item.cancelled === 1 && (
                    <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                      Booking cancelled
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserBookings;
