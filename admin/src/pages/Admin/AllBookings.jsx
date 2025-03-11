import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllBookings = () => {
  const { aToken, bookings, getAllBookings, cancelBooking } =
    useContext(AdminContext);

  const { slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllBookings();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5 ">
      <p className="mb-3 text-lg font-medium">All Bookings</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>User</p>
          <p>ID</p>
          <p>Date & Time</p>
          <p>Service Center</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>

        {bookings.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            <p className="max-sm:hidden">{index + 1}</p>

            <div className="flex items-center gap-2">
              <p>{item.user_data.full_name}</p>
            </div>

            <p className="max-sm:hidden">{item.user_data.user_id}</p>

            <p>
              {slotDateFormat(item.slot_date)}, {item.slot_time}
            </p>

            <div className="flex items-center gap-2">
              <p>{item.sc_data.service_center_name}</p>
            </div>

            <p>
              {currency}
              {item.amount}
            </p>

            {item.cancelled ? (
              <p className="text-red-400 text-xs font-medium">Cancelled</p>
            ) : (
              <img
                onClick={() => cancelBooking(item.booking_id)}
                className="w-10 cursor-pointer"
                src={assets.cancel_icon}
                alt=""
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBookings;
