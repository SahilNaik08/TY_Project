import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import { toast } from "react-toastify";

const TopServCenters = () => {
  // const [Centers, setCenters] = useState()
  const navigate = useNavigate();
  const { Centers } = useContext(AppContext);

  const backend_url = 'http://localhost:3000'

  // const getCentersData = async () => {
  //   console.log(backendUrl + "/api/service-center/list");

  //   try {
  //     const data  = await axios.get(backendUrl + "/api/service-center/list");

  //     if (data.success) {
  //       console.log(data.data)
  //       setCenters(data.Centers);
  //     } else {
  //       toast.error(data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // };

  // useEffect(() => {
  //   console.log('this start');
  //   const getCentersData = async () => {
     
  
  //     try {
  //       const data  = await axios.get(backendUrl + "/api/service-center/list");
  
  //       if (data) {
  //         console.log('this is the main ', data.data.results)
  //         setCenters(data.data.results);
  //       } else {
  //         console.log('else ')
  //         toast.error(data.message);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       toast.error(error.message);
  //     }
  //   };

  //   getCentersData();
    

  // }, []);

  return (
    <div className="w-full flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Service Centers to book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Look for our extensive list of trusted service partners
      </p>

      <div className="w-full">
        {Centers && (
       <div className="grid grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
            {Centers.slice(0,10).map((item, index) => (
          <div
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={index}
            onClick={() => {
              navigate(`/bookings/${item.sc_id}`);
              scrollTo(0, 0);
            }}
          >
            <img className="h-48 w-auto mx-auto object-contain bg-blue-50" src={`http://localhost:3000${item.imageUrl}`} alt="" />
            <div className="p-4">
              <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p>
                <p>{item.available ? 'Available' : "Not Available"}</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.service_center_name}</p>
              <p className="text-gray-600 text-sm">{item.serviceType}</p>
            </div>
          </div>
        ))}
          </div>
        )}
      </div>

      <button
        className="bg-blue-50 text-gray-600 px-12 py-3 rounded-full mt-10"
        onClick={() => {
          navigate("/service-centers");
          scrollTo(0, 0);
        }}
      >
        More
      </button>
    </div>
  );
};

export default TopServCenters;
