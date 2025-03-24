import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ServiceCenters = () => {
  const { serviceType } = useParams();

  const { Centers } = useContext(AppContext);

  const [servCent, setServCent] = useState([]);

  const [showFilter, setShowFilter] = useState(false);

  const [selectedCity, setSelectedCity] = useState("");

  const navigate = useNavigate();

  const applyFilter = () => {
    // if (serviceType) {
    //   setServCent(Centers.filter((cent) => cent.serviceType === serviceType));
    // } else {
    //   setServCent(Centers);
    // }

    let filteredCenters = Centers;

    if (serviceType) {
      filteredCenters = filteredCenters.filter(
        (cent) => cent.serviceType === serviceType
      );
    }

    if (selectedCity) {
      filteredCenters = filteredCenters.filter(
        (cent) => cent.service_center_city === selectedCity
      );
    }

    setServCent(filteredCenters);
  };

  useEffect(() => {
    applyFilter();
  }, [Centers, serviceType, selectedCity]);

  return (
    <div>
      <p className="text-gray-600">Browse through our Trusted partners</p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
        >
          Filters
        </button>

        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          <p
            onClick={() =>
              serviceType === "All Round"
                ? navigate("/service-centers")
                : navigate("/service-centers/All Round")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              serviceType === "All Round" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            All Round
          </p>
          <p
            onClick={() =>
              serviceType === "Car Wash"
                ? navigate("/service-centers")
                : navigate("/service-centers/Car Wash")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              serviceType === "Car Wash" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Car Wash
          </p>
          <p
            onClick={() =>
              serviceType === "Car Maintenance"
                ? navigate("/service-centers")
                : navigate("/service-centers/Car Maintenance")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              serviceType === "Car Maintenance"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Car Maintenance
          </p>
          <p
            onClick={() =>
              serviceType === "Repairs"
                ? navigate("/service-centers")
                : navigate("/service-centers/Repairs")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              serviceType === "Repairs" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Repairs
          </p>
          {/* <p
            onClick={() =>
              serviceType === "Spare Parts"
                ? navigate("/service-centers")
                : navigate("/service-centers/Spare Parts")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              serviceType === "Spare Parts" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Spare Parts
          </p>
          <p
            onClick={() =>
              serviceType === "Roadside Assistence"
                ? navigate("/service-centers")
                : navigate("/service-centers/Roadside Assistence")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              serviceType === "Roadside Assistence"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Roadside Assistence
          </p> */}

          {/* City Filter */}
          <select
            className="w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">Select City</option>
            <option value="Panjim">Panjim</option>
            <option value="Mapusa">Mapusa</option>
            <option value="Porvorim">Porvorim</option>
            <option value="Margao">Margao</option>
          </select>
        </div>

        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {servCent.map((item, index) => (
            <div
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={index}
              onClick={() => navigate(`/bookings/${item.sc_id}`)}
            >
              <img className="h-48 w-auto mx-auto object-contain bg-blue-50" src={`http://localhost:3000${item.imageUrl}`} alt="" />
              <div className="p-4">
              <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p>
                <p>{item.available ? 'Available' : "Not Available"}</p>
              </div>
                <p className="text-gray-900 text-lg font-medium">{item.service_center_name}</p>
                <p className="text-gray-600 text-sm">{item.serviceType}</p>
                <p className="text-gray-600 text-sm">{item.service_center_city}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCenters;
