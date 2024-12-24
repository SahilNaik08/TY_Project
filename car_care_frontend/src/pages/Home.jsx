import React from "react";
import Header from "../components/Header";
import ServicesMenu from "../components/ServicesMenu";
import TopServCenters from "../components/TopServCenters";
import Banner from "../components/Banner";

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
