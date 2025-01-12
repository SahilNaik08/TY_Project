import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllBookings from "./pages/Admin/AllBookings";
import AddServCenter from "./pages/Admin/AddServCenter";
import ServCentersList from "./pages/Admin/ServCentersList";

const App = () => {
  const { aToken } = useContext(AdminContext);

  //if atoken exists show admin panel else login page

  return aToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar></Navbar>
      <div className="flex items-start">
        <Sidebar></Sidebar>

        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-bookings" element={<AllBookings />} />
          <Route path="/add-service-center" element={<AddServCenter />} />
          <Route path="/service-center-list" element={<ServCentersList />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
