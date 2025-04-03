import React from "react";

const Services = ({ serviceType }) => {
  const allRounderServices = [
    { service: "Oil Change", fees: 800, duration: "45 mins" },
    { service: "Car Wash & Wax", fees: 500, duration: "45 mins" },
    { service: "Battery Check & Replacement", fees: 1000, duration: "30 mins" },
    { service: "Wheel Alignment & Balancing", fees: 1200, duration: "60 mins" },
    { service: "Brake Inspection & Service", fees: 900, duration: "50 mins" },
    { service: "AC Servicing", fees: 1500, duration: "60 mins" },
    { service: "Coolant Top-Up", fees: 400, duration: "30 mins" },
    { service: "Air Filter & Fuel Filter Replacement", fees: 700, duration: "40 mins" },
    { service: "Headlight/Fog Light Adjustment", fees: 600, duration: "35 mins" },
    { service: "Interior & Exterior Cleaning", fees: 750, duration: "50 mins" },
  ];

  const carWashServices = [
    { service: "Basic Car Wash", fees: 300, duration: "20 mins" },
    { service: "Exterior Foam Wash", fees: 400, duration: "30 mins" },
    { service: "Interior Vacuum & Wipe", fees: 500, duration: "35 mins" },
    { service: "Underbody Wash", fees: 600, duration: "40 mins" },
    { service: "Full Body Waxing", fees: 1000, duration: "50 mins" },
    { service: "Ceramic Coating", fees: 3000, duration: "60 mins" },
    { service: "Glass Polishing", fees: 800, duration: "45 mins" },
    { service: "Headlight Restoration", fees: 700, duration: "30 mins" },
  ];

  const carMaintenanceServices = [
    { service: "Oil Change", fees: 900, duration: "45 mins" },
    { service: "Coolant Change", fees: 700, duration: "40 mins" },
    { service: "Battery Check & Replacement", fees: 1200, duration: "45 mins" },
    { service: "Brake Pad Replacement", fees: 1500, duration: "60 mins" },
    { service: "Air Filter & Fuel Filter Replacement", fees: 1000, duration: "50 mins" },
    { service: "Wheel Alignment & Balancing", fees: 1300, duration: "60 mins" },
    { service: "AC Servicing", fees: 1800, duration: "75 mins" },
    { service: "Full Car Inspection", fees: 2500, duration: "2 hrs" },
  ];

  const repairServices = [
    { service: "Engine Diagnostic & Repair", fees: 5000, duration: "2-3 hrs" },
    { service: "Transmission Repair", fees: 7000, duration: "3 hrs" },
    { service: "Clutch Replacement", fees: 6000, duration: "2.5 hrs" },
    { service: "Suspension Repair", fees: 4000, duration: "2 hrs" },
    { service: "Brake System Overhaul", fees: 3500, duration: "1.5 hrs" },
    { service: "Radiator & Cooling System Repair", fees: 2500, duration: "1 hr" },
    { service: "Power Steering Repair", fees: 4500, duration: "2 hrs" },
    { service: "Exhaust System Repair", fees: 3000, duration: "1.5 hrs" },
  ];

  const getServicesTable = (services) => (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
      }}
    >
      <thead style={{ backgroundColor: "#5f6fff", color: "white" }}>
        <tr>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Service</th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Fees (Rs.)</th>
          <th style={{ padding: "10px", border: "1px solid #ddd" }}>Duration</th>
        </tr>
      </thead>
      <tbody>
        {services.map((item, index) => (
          <tr
            key={index}
            style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f2f2f2" }}
          >
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.service}</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.fees}</td>
            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{item.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Available Services</h2>
      {serviceType === "All Round" && getServicesTable(allRounderServices)}
      {serviceType === "Car Wash" && getServicesTable(carWashServices)}
      {serviceType === "Car Maintenance" && getServicesTable(carMaintenanceServices)}
      {serviceType === "Repairs" && getServicesTable(repairServices)}
    </div>
  );
};

export default Services;
