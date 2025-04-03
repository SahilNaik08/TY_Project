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
import { ServCenterContext } from "./context/ServCenterContext";
import ScDashboard from "./pages/ServCenter/ScDashboard";
import ScBookings from "./pages/ServCenter/ScBookings";
import ScProfile from "./pages/ServCenter/ScProfile";
import AddRoadsideAssistance from "./pages/Admin/AddRoadsideAssistance"; // ✅ New Page Import

const App = () => {
  const { aToken } = useContext(AdminContext);
  const { scToken } = useContext(ServCenterContext);

  return aToken || scToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />

        <Routes>
          {/* Admin Routes */}
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-bookings" element={<AllBookings />} />
          <Route path="/add-service-center" element={<AddServCenter />} />
          <Route path="/service-center-list" element={<ServCentersList />} />
          <Route path="/add-roadside-assistance" element={<AddRoadsideAssistance />} /> {/* ✅ New Route */}

          {/* SC Routes */}
          <Route path="/service-center-dashboard" element={<ScDashboard />} />
          <Route path="/service-center-bookings" element={<ScBookings />} />
          <Route path="/service-center-profile" element={<ScProfile />} />
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
