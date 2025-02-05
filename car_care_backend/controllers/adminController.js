const validator = require("validator");
const bcrypt = require("bcrypt");
const db = require("../models/ServiceCenterModel.js");
const jwt = require("jsonwebtoken");

// API for adding serv_center
const addServCenter = async (req, res) => {
  try {
    const { sc_name, sc_email, password, serviceType, city, state } = req.body;

    const imageFile = req.file;

    // Checking for all data to add service center (validation)
    if (!sc_name || !sc_email || !password || !serviceType || !city || !state) {
      return res.json({ success: false, message: "Missing details" });
    }

    // Validating email format
    if (!validator.isEmail(sc_email)) {
      return res.json({ success: false, message: "Enter a valid email!" });
    }

    // Validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password!" });
    }

    // Hashing service center password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Uploading image to cloudinary (to be completed)

    // Adding data to database using MySQL query
    const scData = {
      sc_name,
      sc_email,
      password: hashedPassword,
      serviceType,
      city,
      state,
    };

    // Using the db object to run an SQL query
    const query = `INSERT INTO service_center (service_center_name, service_center_email, service_center_passwd, serviceType, service_center_city, service_center_state) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [sc_name, sc_email, hashedPassword, serviceType, city, state];

    db.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: "Failed to add service center" });
      }
      res.json({ success: true, message: "Service center added" });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all service centers list for admin panel
const allServCent = async (req, res) => {
  try {
    const servCenters = await db.find({}).select("-password"); // Doesn't include password
    res.json({ success: true, servCenters });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = { addServCenter, loginAdmin, allServCent };
