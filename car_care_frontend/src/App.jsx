import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ServiceCenters from "./pages/ServiceCenters";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import UserProfile from "./pages/UserProfile";
import UserBookings from "./pages/UserBookings";
import Bookings from "./pages/Bookings";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/service-centers" element={<ServiceCenters />} />
        <Route path="/service-centers/:services" element={<ServiceCenters />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/user-bookings" element={<UserBookings />} />
        <Route path="/bookings/:servcentID" element={<Bookings />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
