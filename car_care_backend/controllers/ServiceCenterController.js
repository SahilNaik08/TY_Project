const { connectDB } = require("../config/database");
const db = connectDB(); // Get MySQL DB connection
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//const db = require("../models/servCenterModel");

// Change Availability of a Service Center
const changeAvailability = async (req, res) => {
  //  try {
  //     const { service_center_email } = req.body;

  //     // Fetch the current availability status (assuming a column `available` exists)
  //     const [scData] = await db.query(
  //       "SELECT available FROM service_center WHERE service_center_email = ?",
  //       [service_center_email]
  //     );

  //     if (!scData.length) {
  //       return res.status(404).json({ success: false, message: "Service Center not found" });
  //     }

  //     // Toggle availability
  //     const newAvailability = !scData[0].available;
  //     await db.query(
  //       "UPDATE service_center SET available = ? WHERE service_center_email = ?",
  //       [newAvailability, service_center_email]
  //     );

  //     res.json({ success: true, message: "Availability changed" });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ success: false, message: error.message });
  //   }
  console.error(" changeAvailability");
};

// Get List of Service Centers (Excluding Password)
const centerList = (req, res) => {
  try {
    const sql = `SELECT sc_id, service_center_email, about, service_center_name, service_center_state, service_center_city, serviceType, imageUrl, slots_booked, available FROM service_center`;

    db.query(sql, (error, results) => {
      if (error) {
        console.log("error", error);
      }

      if (results) {
        //console.log(results)
        res.json({ success: true, results });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
  //console.error(' centerList');
};

//API for sc Login

const loginServCenter = (req, res) => {
  try {
    const { service_center_email, service_center_passwd } = req.body;

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(service_center_email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    // Validate password length
    if (service_center_passwd.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Fetch service center details from the database
    const sql = `SELECT sc_id, service_center_email, service_center_passwd FROM service_center WHERE service_center_email = ?`;

    db.query(sql, [service_center_email], async (error, results) => {
      if (error) {
        console.log("error", error);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      const serviceCenter = results[0];

      // Compare password
      const isMatch = await bcrypt.compare(
        service_center_passwd,
        serviceCenter.service_center_passwd
      );

      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { email: serviceCenter.service_center_email },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );

      res.json({ success: true, token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//API to get sc bookings for sc panel
const bookingsServCenter = (req, res) => {
  try {
    const { service_center_email } = req.body;

    // First, get sc_id using service_center_email
    const getScIdQuery = `SELECT sc_id FROM service_center WHERE service_center_email = ?`;

    db.query(getScIdQuery, [service_center_email], (error, results) => {
      if (error) {
        console.log("Database error:", error);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Service center not found" });
      }

      const sc_id = results[0].sc_id;

      // Now, get bookings using sc_id
      const getBookingsQuery = `SELECT * FROM bookings WHERE sc_id = ?`;

      db.query(getBookingsQuery, [sc_id], (error, bookings) => {
        if (error) {
          console.log("Database error:", error);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }

        res.json({ success: true, bookings });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//api to mark booking as completed for sc panel
const bookingComplete = async (req, res) => {
  try {
    const { service_center_email, booking_id } = req.body;

    if (!service_center_email || !booking_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Get sc_id using service_center_email
    const getScIdQuery = `SELECT sc_id FROM service_center WHERE service_center_email = ?`;

    db.query(getScIdQuery, [service_center_email], (error, results) => {
      if (error) {
        console.log("Database error:", error);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Service center not found" });
      }

      const sc_id = results[0].sc_id; // Get the actual sc_id

      // Fetch booking details using sc_id
      const getBookingQuery = `SELECT * FROM bookings WHERE booking_id = ?`;

      db.query(getBookingQuery, [booking_id], (error, results) => {
        if (error) {
          console.log("Database error:", error);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }

        if (results.length === 0) {
          return res.json({ success: false, message: "Booking not found" });
        }

        const bookingData = results[0];

        // Check if the booking belongs to the given service center
        if (bookingData.sc_id === sc_id) {
          // Mark the booking as completed
          const updateBookingQuery = `UPDATE bookings SET is_completed = 1 WHERE booking_id = ?`;

          db.query(updateBookingQuery, [booking_id], (updateError) => {
            if (updateError) {
              console.log("Database error:", updateError);
              return res
                .status(500)
                .json({ success: false, message: "Database error" });
            }

            return res.json({ success: true, message: "Booking Completed" });
          });
        } else {
          return res.json({
            success: false,
            message: "Booking Completion Failed",
          });
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//api to mark booking as cancelled and also cancel it for sc panel
const bookingCancel = async (req, res) => {
  try {
    const { service_center_email, booking_id } = req.body;

    if (!service_center_email || !booking_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Get sc_id using service_center_email
    const getScIdQuery = `SELECT sc_id FROM service_center WHERE service_center_email = ?`;

    db.query(getScIdQuery, [service_center_email], (error, results) => {
      if (error) {
        console.log("Database error:", error);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Service center not found" });
      }

      const sc_id = results[0].sc_id; // Get the actual sc_id

      // Fetch booking details using sc_id
      const getBookingQuery = `SELECT * FROM bookings WHERE booking_id = ?`;

      db.query(getBookingQuery, [booking_id], (error, results) => {
        if (error) {
          console.log("Database error:", error);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }

        if (results.length === 0) {
          return res.json({ success: false, message: "Booking not found" });
        }

        const bookingData = results[0];

        // Check if the booking belongs to the given service center
        if (bookingData.sc_id === sc_id) {
          // Mark the booking as cancelled
          const updateBookingQuery = `UPDATE bookings SET cancelled = 1 WHERE booking_id = ?`;

          db.query(updateBookingQuery, [booking_id], (updateError) => {
            if (updateError) {
              console.log("Database error:", updateError);
              return res
                .status(500)
                .json({ success: false, message: "Database error" });
            }

            return res.json({ success: true, message: "Booking Cancelled" });
          });
        } else {
          return res.json({
            success: false,
            message: "Booking Cancellation Failed",
          });
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//api to get dashboard data for sc panel
const serviceCenterDashboard = async (req, res) => {
  try {
    const { service_center_email } = req.body;

    if (!service_center_email) {
      return res
        .status(400)
        .json({ success: false, message: "Service center email is required" });
    }

    // Get service center ID using email
    const getScIdQuery = `SELECT sc_id FROM service_center WHERE service_center_email = ?`;

    db.query(getScIdQuery, [service_center_email], (err, scResult) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (scResult.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Service center not found" });
      }

      const sc_id = scResult[0].sc_id;

      // Queries for dashboard data
      const totalBookingsQuery = `SELECT COUNT(*) AS totalBookings FROM bookings WHERE sc_id = ?`;
      const totalUsersQuery = `SELECT COUNT(DISTINCT user_id) AS totalUsers FROM bookings WHERE sc_id = ?`;
      const earningsQuery = `SELECT SUM(amount) AS totalEarnings FROM bookings WHERE sc_id = ? AND is_completed = 1`;
      const latestBookingsQuery = `SELECT * FROM bookings WHERE sc_id = ? ORDER BY booking_id DESC LIMIT 5`;

      db.query(totalBookingsQuery, [sc_id], (err, totalBookingsResult) => {
        if (err) {
          console.error("Error fetching total bookings:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }

        db.query(totalUsersQuery, [sc_id], (err, totalUsersResult) => {
          if (err) {
            console.error("Error fetching total users:", err);
            return res
              .status(500)
              .json({ success: false, message: "Database error" });
          }

          db.query(earningsQuery, [sc_id], (err, earningsResult) => {
            if (err) {
              console.error("Error fetching earnings:", err);
              return res
                .status(500)
                .json({ success: false, message: "Database error" });
            }

            db.query(
              latestBookingsQuery,
              [sc_id],
              (err, latestBookingsResult) => {
                if (err) {
                  console.error("Error fetching latest bookings:", err);
                  return res
                    .status(500)
                    .json({ success: false, message: "Database error" });
                }

                const dashData = {
                  sc_id,
                  totalBookings: totalBookingsResult[0].totalBookings || 0,
                  totalUsers: totalUsersResult[0].totalUsers || 0, // Unique users count
                  totalEarnings: earningsResult[0].totalEarnings || 0,
                  latestBookings: latestBookingsResult,
                };

                res.json({ success: true, dashData });
              }
            );
          });
        });
      });
    });
  } catch (error) {
    console.error("Error fetching service center dashboard data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//api to get sc profile
const serviceCenterProfile = async (req, res) => {
  try {
    const { service_center_email } = req.body;

    if (!service_center_email) {
      return res
        .status(400)
        .json({ success: false, message: "Service center email is required" });
    }

    // Query to get service center profile (excluding password)
    const profileQuery = `
      SELECT sc_id, service_center_name, service_center_email, 
             service_center_state, service_center_city, serviceType, 
             imageUrl, about, available, slots_booked 
      FROM service_center 
      WHERE service_center_email = ?
    `;

    db.query(profileQuery, [service_center_email], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Service center not found" });
      }

      const profileData = results[0];

      res.json({ success: true, profileData });
    });
  } catch (error) {
    console.error("Error fetching service center profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to update service center profile in SC panel
const updateServiceCenterProfile = async (req, res) => {
  try {
    const {
      service_center_email,
      service_center_name,
      service_center_state,
      service_center_city,
      available,
      about,
    } = req.body;

    if (!service_center_email) {
      return res
        .status(400)
        .json({ success: false, message: "Service center email is required" });
    }

    // Query to update the required fields, including 'about'
    const updateProfileQuery = `
      UPDATE service_center 
      SET service_center_name = ?, service_center_state = ?, 
          service_center_city = ?, available = ?, about = ?
      WHERE service_center_email = ?
    `;

    const values = [
      service_center_name,
      service_center_state,
      service_center_city,
      available,
      about,
      service_center_email,
    ];

    db.query(updateProfileQuery, values, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Service center not found" });
      }

      res.json({ success: true, message: "Profile Updated" });
    });
  } catch (error) {
    console.error("Error updating service center profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to fetch reviews
const fetchReviews = async (req, res) => {
  try {
    const { sc_id } = req.params; // Extract sc_id from URL params

    console.log("rev");
    

    // Validate sc_id
    if (!sc_id) {
      return res.status(400).json({ success: false, message: "Service center ID is required" });
    }

    // Check if the service center exists
    db.query("SELECT sc_id FROM service_center WHERE sc_id = ?", [sc_id], (err, scResult) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
      }

      if (scResult.length === 0) {
        return res.status(404).json({ success: false, message: "Service Center not found" });
      }

      // Fetch reviews linked to this service center
      db.query(
        `SELECT review_id AS id, rating, review_text AS comment
         FROM review
         WHERE sc_id = ? 
         ORDER BY review_id DESC`,
        [sc_id],
        (err, reviewResults) => {
          if (err) {
            console.error("Error fetching reviews:", err);
            return res.status(500).json({ success: false, message: "Error fetching reviews" });
          }

          //console.log("Review results:", reviewResults);
          

          res.json({ success: true, reviews: reviewResults });
        }
      );
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ success: false, message: "Unexpected error occurred" });
  }
};


module.exports = {
  changeAvailability,
  centerList,
  loginServCenter,
  bookingsServCenter,
  bookingCancel,
  bookingComplete,
  serviceCenterDashboard,
  serviceCenterProfile,
  updateServiceCenterProfile,
  fetchReviews,
};
