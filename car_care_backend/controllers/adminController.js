// controllers/adminController.js
const validator = require("validator");
const bcrypt = require("bcrypt");
const db = require("../models/ServiceCenterModel.js");
const jwt = require("jsonwebtoken");

// API for adding service center
const addServCenter = async (req, res) => {
  try {
    const { sc_name, sc_email, password, serviceType, city, state, about } = req.body;
    const imageFile = req.file;  // image file received from multer

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

    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
if (imageFile && !allowedFileTypes.includes(imageFile.mimetype)) {
  return res.status(400).json({ success: false, message: 'Invalid image type! Only jpg, jpeg, and png are allowed.' });
}

const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : '/uploads/SC1.png';

    // Prepare data for insertion into the database
    const scData = {
      sc_name,
      sc_email,
      password: hashedPassword,
      serviceType,
      city,
      state,
      imageUrl,
      about,
    };

    // Insert data into database
    const query = `INSERT INTO service_center (service_center_name, service_center_email, service_center_passwd, serviceType, service_center_city, service_center_state, imageUrl, about) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [sc_name, sc_email, hashedPassword, serviceType, city, state, scData.imageUrl, about];

    db.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: "Failed to add service center" });
      }
      res.json({ success: true, message: "Service center added", imageUrl: scData.imageUrl });
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
    const query = `SELECT service_center_name, service_center_email, serviceType, service_center_city, service_center_state, imageUrl, about FROM service_center`; // Excludes password

    db.query(query, (error, results) => {
      if (error) {
        console.error("Database Query Error:", error);
        return res.status(500).json({ success: false, message: "Database query failed" });
      }

      res.json({ success: true, centers: results });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


module.exports = { addServCenter, loginAdmin, allServCent };
