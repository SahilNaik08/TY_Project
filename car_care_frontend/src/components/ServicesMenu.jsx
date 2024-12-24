import React from "react";
import { serviceTypeData } from "..//assets/assets";
import { Link } from "react-router-dom";

const ServicesMenu = () => {
  return (
    <div
      id="service_type"
      className="flex flex-col items-center gap-4 py-16 text-gray-800"
    >
      <h1 className="text-3xl font-medium">Find by Service Type</h1>

      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted Car Care Centers,
        hassle-free.
      </p>

      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll ">
        {serviceTypeData.map((item, index) => (
          <Link
            key={index}
            className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
            onClick={() => scrollTo(0, 0)}
            to={`/service-centers/${item.serviceType}`}
          >
            <img className="w-16 sm:w-24 mb-2 " src={item.image} alt="" />
            <p>{item.serviceType}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServicesMenu;
