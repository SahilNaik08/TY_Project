import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const RoadsideAsst = () => {
  const { RoadsideAssistances } = useContext(AppContext);
  const [selectedCity, setSelectedCity] = useState("");

  const filteredServices = selectedCity
    ? RoadsideAssistances.filter((service) => service.city === selectedCity)
    : RoadsideAssistances;

  return (
    <div>
      <p className="text-gray-600">Find Trusted Roadside Assistance Services</p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Filter Section */}
        <div className="flex flex-col gap-4 text-sm text-gray-600">
          <select
            className="w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">Select City</option>
            {[...new Set(RoadsideAssistances.map((service) => service.city))].map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Service List */}
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filteredServices.map((service) => (
            <div
              key={service.ra_id}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            >
              <img
                className="h-48 w-auto mx-auto object-contain bg-blue-50"
                src={`http://localhost:3000${service.image_url}`}
                alt={service.ra_name}
              />
              <div className="p-4">
                <p className="text-gray-900 text-lg font-medium">
                  {service.ra_name}
                </p>
                <p className="text-gray-600 text-sm">{service.city}</p>
                <p className="text-blue-500 text-sm font-semibold">
                  ☎️ {service.contact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadsideAsst;
