import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Welcome to Car Care Express, your one-stop solution for premium car
            care services. We specialize in providing top-notch car washing,
            detailing, and maintenance services tailored to meet your needs.
            With a commitment to excellence and customer satisfaction, we are
            revolutionizing the way car care is done by combining cutting-edge
            technology with unparalleled convenience.
          </p>
          <p>
            At Car Care Express, we understand the importance of your
            vehicle—not just as a mode of transportation but as an essential
            part of your daily life. That's why our team of skilled
            professionals works tirelessly to deliver a seamless and satisfying
            experience every time.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            To become the most trusted and innovative car care service provider,
            delivering exceptional quality and convenience to every customer
            while promoting eco-friendly practices. Our vision is to redefine
            car care by making it accessible, personalized, and effortless for
            everyone.
          </p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>EFFICIENCY:</b>
          <p>
            We value your time and strive to provide services that are quick
            without compromising on quality. Our state-of-the-art tools and
            trained professionals ensure your car is serviced to perfection,
            saving you precious hours.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>CONVENIENCE: </b>
          <p>
            With Car Care Express, car care has never been easier. Whether you
            visit our centers or book a service from the comfort of your home,
            our seamless scheduling system and mobile services bring the care to
            you.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>PERSONALIZATION:</b>
          <p>
            Every car is unique, and so are its needs. We offer customizable
            service packages tailored to your specific requirements, ensuring
            your vehicle gets the care it deserves.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
