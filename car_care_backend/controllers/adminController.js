// controllers/adminController.js
const validator = require("validator");
const bcrypt = require("bcrypt");
const db = require("../models/ServiceCenterModel.js");
const jwt = require("jsonwebtoken");

// API for adding service center
const addServCenter = async (req, res) => {
  try {
    const { sc_name, sc_email, password, serviceType, city, state, about } =
      req.body;
    const imageFile = req.file; // image file received from multer

    // Checking for all required fields
    if (!sc_name || !sc_email || !password || !serviceType || !city || !state) {
      return res.json({ success: false, message: "Missing details" });
    }

    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sc_email)) {
      return res.json({ success: false, message: "Enter a valid email!" });
    }

    // Password validation (minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.json({
        success: false,
        message:
          "Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
      });
    }

    // Hashing service center password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // File type validation (Only jpg, jpeg, png)
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (imageFile && !allowedFileTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image type! Only jpg, jpeg, and png are allowed.",
      });
    }

    // Default image if none is provided
    const imageUrl = imageFile
      ? `/uploads/${imageFile.filename}`
      : "/uploads/SC1.png";

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
      slots_booked: JSON.stringify({ "11_3_2025": ["09:00 AM"] }), // Default value
    };

    // // Insert data into database
    // const query = `INSERT INTO service_center (service_center_name, service_center_email, service_center_passwd, serviceType, service_center_city, service_center_state, imageUrl, about) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    // const values = [
    //   sc_name,
    //   sc_email,
    //   hashedPassword,
    //   serviceType,
    //   city,
    //   state,
    //   scData.imageUrl,
    //   about,
    // ];

    // Modify the SQL query to include `slots_booked`
    const query = `INSERT INTO service_center (service_center_name, service_center_email, service_center_passwd, serviceType,service_center_city, service_center_state, imageUrl, about, slots_booked) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      sc_name,
      sc_email,
      hashedPassword,
      serviceType,
      city,
      state,
      scData.imageUrl,
      about,
      scData.slots_booked, // Insert default slots_booked value
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false,
          message: "Failed to add service center",
        });
      }
      res.json({
        success: true,
        message: "Service center added",
        imageUrl: scData.imageUrl,
      });
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

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    // Validate password length
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

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
    const query = `SELECT sc_id, service_center_name, service_center_email, serviceType, service_center_city, service_center_state, imageUrl, available about FROM service_center`; // Excludes password

    db.query(query, (error, results) => {
      if (error) {
        console.error("Database Query Error:", error);
        return res
          .status(500)
          .json({ success: false, message: "Database query failed" });
      }

      res.json({ success: true, centers: results });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//API to get all bookings list

const bookingsAdmin = async (req, res) => {
  try {
    db.query("SELECT * FROM bookings", (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          success: false,
          message: "Database query failed",
          error: err.message,
        });
      }
      if (!results.length) {
        return res
          .status(404)
          .json({ success: false, message: "No bookings found" });
      }
      //console.log('results : ',results);

      res.json({ success: true, bookings: results || [] });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//api to cancel appt for admin panel

const bookingCancel = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    // Fetch booking details
    db.query(
      "SELECT * FROM bookings WHERE booking_id = ?",
      [bookingId],
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }

        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Booking not found",
          });
        }

        const { sc_id, slot_date, slot_time } = results[0];

        // Cancel the booking (set cancelled = 1)
        db.query(
          "UPDATE bookings SET cancelled = 1 WHERE booking_id = ?",
          [bookingId],
          (updateErr) => {
            if (updateErr) {
              console.error("Error updating booking:", updateErr);
              return res.status(500).json({
                success: false,
                message: "Failed to cancel booking",
              });
            }

            // Fetch service center slots
            db.query(
              "SELECT slots_booked FROM service_center WHERE sc_id = ?",
              [sc_id],
              (scErr, scResults) => {
                if (scErr) {
                  console.error("Error fetching service center:", scErr);
                  return res.status(500).json({
                    success: false,
                    message: "Failed to update service center slots",
                  });
                }

                if (scResults.length === 0) {
                  return res.json({
                    success: true,
                    message: "Booking cancelled, but service center not found",
                  });
                }

                let slotsBooked = scResults[0].slots_booked
                  ? JSON.parse(scResults[0].slots_booked)
                  : {};

                // Remove slot from booked slots
                if (slotsBooked[slot_date]) {
                  slotsBooked[slot_date] = slotsBooked[slot_date].filter(
                    (time) => time !== slot_time
                  );
                  if (slotsBooked[slot_date].length === 0) {
                    delete slotsBooked[slot_date]; // Remove empty date entries
                  }
                }

                // Update service center slots in the database
                db.query(
                  "UPDATE service_center SET slots_booked = ? WHERE sc_id = ?",
                  [JSON.stringify(slotsBooked), sc_id],
                  (updateScErr) => {
                    if (updateScErr) {
                      console.error("Error updating slots:", updateScErr);
                      return res.status(500).json({
                        success: false,
                        message: "Failed to update service center slots",
                      });
                    }

                    res.json({
                      success: true,
                      message: "Booking cancelled successfully",
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//api for dashboard data
const adminDashboard = async (req, res) => {
  try {
    // Fetch total number of users, bookings, and service centers
    const usersQuery = "SELECT COUNT(*) AS totalUsers FROM users";
    const bookingsQuery = "SELECT COUNT(*) AS totalBookings FROM bookings";
    const serviceCentersQuery =
      "SELECT COUNT(*) AS totalServiceCenters FROM service_center";
    const latestBookingsQuery =
      "SELECT * FROM bookings ORDER BY booking_id DESC LIMIT 5";

    db.query(usersQuery, (err, usersResult) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      db.query(bookingsQuery, (err, bookingsResult) => {
        if (err) {
          console.error("Error fetching bookings:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }

        db.query(serviceCentersQuery, (err, serviceCentersResult) => {
          if (err) {
            console.error("Error fetching service centers:", err);
            return res
              .status(500)
              .json({ success: false, message: "Database error" });
          }

          db.query(latestBookingsQuery, (err, latestBookingsResult) => {
            if (err) {
              console.error("Error fetching latest bookings:", err);
              return res
                .status(500)
                .json({ success: false, message: "Database error" });
            }

            const dashData = {
              totalUsers: usersResult[0].totalUsers,
              totalBookings: bookingsResult[0].totalBookings,
              totalServiceCenters: serviceCentersResult[0].totalServiceCenters,
              latestBookings: latestBookingsResult,
            };

            res.json({ success: true, dashData });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Change Availability of a Service Center
const changeAvailability = async (req, res) => {
  try {
    const { service_center_email } = req.body;

    // Fetch the current availability status
    db.query(
      "SELECT available FROM service_center WHERE service_center_email = ?",
      [service_center_email],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ success: false, message: err.message });
        }

        if (!result.length) {
          return res
            .status(404)
            .json({ success: false, message: "Service Center not found" });
        }

        // Toggle availability
        const newAvailability = !result[0].available;

        db.query(
          "UPDATE service_center SET available = ? WHERE service_center_email = ?",
          [newAvailability, service_center_email],
          (updateErr) => {
            if (updateErr) {
              console.error(updateErr);
              return res
                .status(500)
                .json({ success: false, message: updateErr.message });
            }

            res.json({ success: true, message: "Availability changed" });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }

  //console.error(' changeAvailability');
};

//api to add roadside assistance
const addRoadsideAssistance = async (req, res) => {
  try {
    const { ra_name, ra_email, password, contact, city, state } = req.body;
    const imageFile = req.file; // Image file received from multer

    // Checking for all required fields
    if (!ra_name || !ra_email || !password || !contact || !city) {
      return res.json({ success: false, message: "Missing required details" });
    }

    // Email validation using regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(ra_email)) {
      return res.json({ success: false, message: "Enter a valid email!" });
    }

    // Password validation (minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.json({
        success: false,
        message:
          "Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.",
      });
    }

    // Contact number validation (exactly 10 digits)
    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(contact)) {
      return res.json({ success: false, message: "Enter a valid 10-digit contact number!" });
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // File type validation (Only jpg, jpeg, png)
    const allowedFileTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (imageFile && !allowedFileTypes.includes(imageFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image type! Only jpg, jpeg, and png are allowed.",
      });
    }

    // Default image if none is provided
    const imageUrl = imageFile ? `/uploads/${imageFile.filename}` : null;

    // Prepare data for insertion into the database
    const raData = {
      ra_name,
      ra_email,
      password_hash: hashedPassword,
      contact,
      city,
      state: state || "Goa", // Default state is Goa
      image_url: imageUrl,
    };

    // Insert data into database
    const query = `INSERT INTO roadside_assistance (ra_name, ra_email, password_hash, contact, city, state, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      raData.ra_name,
      raData.ra_email,
      raData.password_hash,
      raData.contact,
      raData.city,
      raData.state,
      raData.image_url,
    ];

    db.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: "Failed to add roadside assistance" });
      }
      res.json({
        success: true,
        message: "Roadside assistance added successfully",
        imageUrl: raData.image_url,
      });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


module.exports = {
  addServCenter,
  loginAdmin,
  allServCent,
  bookingsAdmin,
  bookingCancel,
  adminDashboard,
  changeAvailability,
  addRoadsideAssistance,
};
