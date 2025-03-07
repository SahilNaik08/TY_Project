import React from "react";
import Header from "../components/Header";
import ServicesMenu from "../components/ServicesMenu";
import TopServCenters from "../components/TopServCenters";
import Banner from "../components/Banner";
import axios from "axios";
import { useEffect } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const Home = () => {

  return (
    <div>
      <Header />
      <ServicesMenu />
      <TopServCenters />
      <Banner />
    </div>
  );
};

export default Home;
