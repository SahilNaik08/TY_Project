const { connectDB } = require('../config/database');
const db = connectDB(); // Get MySQL DB connection
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//const db = require("../models/servCenterModel"); 

// Change Availability of a Service Center
const changeAvailability = async (req, res) => {
  try {
    const { service_center_email } = req.body;

    // Fetch the current availability status (assuming a column `available` exists)
    const [scData] = await db.query(
      "SELECT available FROM service_center WHERE service_center_email = ?",
      [service_center_email]
    );

    if (!scData.length) {
      return res.status(404).json({ success: false, message: "Service Center not found" });
    }

    // Toggle availability
    const newAvailability = !scData[0].available;
    await db.query(
      "UPDATE service_center SET available = ? WHERE service_center_email = ?",
      [newAvailability, service_center_email]
    );

    res.json({ success: true, message: "Availability changed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get List of Service Centers (Excluding Password)
const centerList = async (req, res) => {
  try {
    const [centers] = await db.query(
      "SELECT service_center_email, service_center_name, service_center_state, service_center_city, serviceType, imageUrl, availabile FROM service_center"
    );
 console.log(centers)
    res.json({ success: true, centers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//API for sc Login

const loginServCenter = async (req, res) => {

  try {

    const { service_center_email, service_center_passwd } = req.body;

    // Fetch service center details from the database
    const [rows] = await db.query(
      "SELECT service_center_email, service_center_passwd FROM service_center WHERE service_center_email = ?",
      [service_center_email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const serviceCenter = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, serviceCenter.service_center_passwd);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: serviceCenter.service_center_email }, 
      process.env.JWT_SECRET, 
      { expiresIn: "3h" }
    );

    res.json({ success: true, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { changeAvailability, centerList, loginServCenter };
