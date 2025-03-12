import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedServiceCenters = ({ sc_id, serviceType }) => {
  const { Centers } = useContext(AppContext);

  const navigate = useNavigate();

  const [relatedSc, setRelatedSc] = useState([]);

  useEffect(() => {
    if (Centers.length > 0 && serviceType) {
      const scData = Centers.filter(
        (cent) => cent.serviceType === serviceType && cent.sc_id !== sc_id
      );
      setRelatedSc(scData);
    }
  }, [Centers, serviceType, sc_id]);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Related Service Centers to book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Look for our extensive list of trusted service partners
      </p>

      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {relatedSc.slice(0, 5).map((item, index) => (
          <div
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={index}
            onClick={() => {
              navigate(`/bookings/${item.sc_id}`);
              scrollTo(0, 0);
            }}
          >
            <img className="bg-blue-50" src={`http://localhost:3000${item.imageUrl}`} alt="" />
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

export default RelatedServiceCenters;
