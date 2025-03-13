import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-stretch bg-primary rounded-lg px-6 md:px-10 lg:px-20">
      {/*--- Left half ---*/}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 text-white">
        <p className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
          Book Services <br className="hidden sm:block" />
          with the most trusted Car Care Centers
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3 text-sm font-medium">
          <img className="w-28" src={assets.group_profiles} alt="Profiles" />
          <p className="text-center md:text-left">
            Simply browse through our extensive list of trusted centers, <br className="hidden sm:block" />
            schedule your appointments hassle-free.
          </p>
        </div>
        <a
          href="#service_type"
          className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm hover:scale-110 transition-transform duration-300 shadow-md"
        >
          Book Service <img className="w-3" src={assets.arrow_icon} alt="Arrow" />
        </a>
      </div>

      {/*--- Right half ---*/}
      <div className="md:w-1/2 flex justify-end">
        <img
          className="w-[90%] max-w-[400px] object-contain rounded-lg"
          src={assets.header_img}
          alt="Mechanic"
        />
      </div>
    </div>
  );
};

export default Header;
