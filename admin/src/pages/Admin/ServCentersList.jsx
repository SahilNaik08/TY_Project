import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
//import test from "../../../../car_care_backend/uploads/SC1.png";
const ServCentersList = () => {
  const { centers, aToken, getAllServCenters, changeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllServCenters();
    }
  }, [aToken]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Service Centers</h1>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {centers.map((item, index) => (
          <div
            className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group"
            key={index}
          >
            <img
              className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 h-48 w-auto mx-auto object-contain"
             
              src={`http://localhost:3000${item.imageUrl}`}
              alt=""
            />

            <div className="p-4">
              <p className="text-[#262626] text-lg font-medium">{item.service_center_name}</p>
              <p className="text-[#5C5C5C] text-sm">{item.serviceType}</p>

              <div className="mt-2 flex items-center gap-1 text-sm">
                <input
                  onChange={() => changeAvailability(item.service_center_email)}
                  type="checkbox"
                  checked={item.about} //changed to about from available
                />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServCentersList;
