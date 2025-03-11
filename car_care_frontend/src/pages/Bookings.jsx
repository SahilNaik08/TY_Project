import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedServiceCenters from "../components/RelatedServiceCenters";
import { toast } from "react-toastify";
import axios from "axios";

const Bookings = () => {
  const { sc_id } = useParams();

  console.log("scId from URL:", sc_id);

  const { Centers, currencySymbol, backendUrl, token, getCentersData } =
    useContext(AppContext);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [scInfo, setScInfo] = useState(null);

  const [scSlot, setScSlot] = useState([]);

  const [slotIndex, setSlotIndex] = useState(0);

  const [slotTime, setSlotTime] = useState("");

  const fetchScInfo = async () => {
    console.log("sc id = ", sc_id);
    console.log("centers : ", Centers);

    console.log("Searching for sc_id:", sc_id, "Type:", typeof sc_id);

    const scInfo = Centers.find((sc) => String(sc.sc_id) === sc_id);
    setScInfo(scInfo);

    console.log("Checking service center IDs in Centers array:");
    Centers.forEach((sc) => console.log("Center ID:", sc.sc_id));
  };

  console.log("Final scInfo state:", scInfo);

  const navigate = useNavigate();

  const getAvailableSlots = async () => {
    setScSlot([]);

    // if (!scInfo || !scInfo.slots_booked) {
    //   console.log(
    //     "scInfo or slots_booked is undefined, skipping... scInfo :",
    //     scInfo
    //   );

    //   return;
    // }

    // console.log('scInfo : ',scInfo);
    // console.log('scInfo.slots_booked : ', scInfo.slots_booked);

    //getting current date

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate
          .toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // Ensures consistency
          })
          .replace(/^0/, ""); // Removes leading zeros if present

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;

        //console.log('scinfo : ',scInfo);

        // console.log(
        //   "Available dates in slots_booked:",
        //   Object.keys(scInfo.slots_booked)
        // );
        console.log("Checking slotDate:", slotDate);

        //if slot is booked, that slot won't be displayed
        const isSlotAvailable =
          scInfo.slots_booked[slotDate] &&
          scInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          // Add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // console.log("Checking booked slots for date:", slotDate);
        // console.log("Booked slots:", scInfo.slots_booked[slotDate]);
        // console.log("Current slot being checked:", formattedTime);

        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setScSlot((prev) => [...prev, timeSlots]);
    }
  };

  //api function
  const bookSlot = async () => {
    if (!token) {
      toast.warning("Login to book appointment");
      return navigate("/login");
    }

    const date = scSlot[slotIndex][0].datetime;

    let day = date.getDate();
    let month = date.getMonth() + 1; // +1 since jan = 0, thus after +1 jan = 1
    let year = date.getFullYear();

    const slotDate = day + "_" + month + "_" + year;

    console.log("scId : ", sc_id);

    const scIdInt = parseInt(sc_id, 10); // Convert sc_id to a number

    //console.log("Final sc_id being sent:", scIdInt);

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/book-slot",
        { sc_id: scIdInt, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getCentersData();
        navigate("/user-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchScInfo();
  }, [sc_id, Centers]);

  useEffect(() => {
    if (scInfo) {
      getAvailableSlots();
    }
  }, [scInfo]);

  useEffect(() => {}, [scSlot]);

  const fees = 1500;

  return (
    scInfo && (
      <div>
        {/*Service Center Details */}

        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={`http://localhost:3000${scInfo.imageUrl}`}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/*Service Center Details */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {scInfo.service_center_name}
              <img className="w-3" src={assets.verified_icon} alt="" />
            </p>

            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                City : {scInfo.service_center_city}, <br></br>Services :{" "}
                {scInfo.serviceType}
              </p>
              <br />

              <button className="py-0.5 px-2 border text-xs rounded-full">
                Contact : {scInfo.service_center_email}
              </button>
            </div>

            {/*Services Offered */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                Services Offered <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {scInfo.serviceType}
              </p>
            </div>

            <p className="text-gray-500 font-medium mt-4">
              Booking fee:{" "}
              <span className="text-gray-900">
                {currencySymbol}
                {fees}
              </span>
            </p>
          </div>
        </div>

        {/*Booking slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Available Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {
              scSlot.map((item, index) => (
                <div
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                  onClick={() => setSlotIndex(index)}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
            }
          </div>

          

          {/* <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {

              
              
              scSlot[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  key={index}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))
            }
          </div> */}

<div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
  {
    scSlot[slotIndex] && Array.isArray(scSlot[slotIndex]) ? (
      scSlot[slotIndex].map((item, index) => (
        <p
          onClick={() => setSlotTime(item.time)}
          key={index}
          className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
            item.time === slotTime
              ? "bg-primary text-white"
              : "text-gray-400 border border-gray-300"
          }`}
        >
          {item.time.toLowerCase()}
        </p>
      ))
    ) : (
      <p className="text-gray-500">No slots available</p>
    )
  }
</div>




          <button
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
            onClick={bookSlot}
          >
            Book this Slot
          </button>
        </div>

        {/*Listing related service centers */}

        <RelatedServiceCenters sc_id={sc_id} serviceType={scInfo.serviceType} />
      </div>
    )
  );
};

export default Bookings;
