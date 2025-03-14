const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { connectDB } = require("../config/database");
const db = connectDB();

// API to register user
const registerUser = async (req, res) => {
  try {
    const { full_name, user_email, password } = req.body;

    // Checking for all required fields
    if (!full_name || !user_email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Fields" });
    }

    // Validating email format
    if (!validator.isEmail(user_email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }

    // Validating password strength
    if (password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please enter a strong password (8+ characters)",
        });
    }

    // Hashing the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if user already exists
    const checkUserQuery = `SELECT user_id FROM users WHERE user_email = ?`;
    db.query(checkUserQuery, [user_email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (results.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }

      // Insert new user with default values for other fields
      const insertUserQuery = `
        INSERT INTO users (full_name, user_email, password, city, state, usr_img, address, phone, dob, gender) 
        VALUES (?, ?, ?, NULL, NULL, 'uploads_user_img/profile_pic.png', NULL, NULL, NULL, NULL)
      `;

      db.query(
        insertUserQuery,
        [full_name, user_email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("Database error:", err);
            return res
              .status(500)
              .json({ success: false, message: "Database error" });
          }

          // Get the inserted user's ID
          const userId = result.insertId;

          // Generate JWT token
          const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: "7d",
          });

          res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
              user_id: userId,
              full_name,
              user_email,
              usr_img: "uploads_user_img/profile_pic.png",
            },
          });
        }
      );
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { user_email, password } = req.body;

    // Check if user exists
    const checkUserQuery = `SELECT user_id, password FROM users WHERE user_email = ?`;
    db.query(checkUserQuery, [user_email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "User does not exist" });
      }

      const user = results[0];

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({ success: true, token, user_id: user.user_id });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//API to get user profile data

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // SQL query to fetch user profile (excluding password)
    const getUserQuery = `SELECT user_id, full_name, user_email, city, state, usr_img, address, phone, dob, gender FROM users WHERE user_id = ?`;

    db.query(getUserQuery, [userId], (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (results.length === 0) {
        return res.json({ success: false, message: "User not found" });
      }

      res.json({ success: true, userData: results[0] });
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//API to update user profile

const updateProfile = async (req, res) => {
  try {
    const { userId, full_name, phone, address, dob, gender } = req.body;
    //const imageFile = req.file;

    //console.log(req.body);

    if (!userId || !full_name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    // Update user profile in MySQL
    const updateUserQuery = "UPDATE users SET full_name = ?, phone = ?, address = ?, dob = ?, gender = ? WHERE user_id = ?";

    db.query(
      updateUserQuery,
      [full_name, phone, JSON.stringify(address), dob, gender, userId],
      async (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }

        

        res.json({ success: true, message: "Profile Updated" });
      }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to make a booking
const bookSlot = async (req, res) => {
  try {
    //console.log(req.body);
    const { sc_id, slotDate, slotTime, userId } = req.body;

    // console.log(req.body);
    // console.log('sdID : ', scId);

    // Fetch service center data
    db.query(
      "SELECT * FROM service_center WHERE sc_id = ?",
      [sc_id],
      (err, scDataResult) => {
        if (err) {
          console.error(err);
          return res.json({ success: false, message: "Internal Server Error" });
        }

        if (scDataResult.length === 0) {
          return res.json({
            success: false,
            message: "Service Center Not Found",
          });
        }

        let scData = scDataResult[0];

        if (!scData.available) {
          return res.json({
            success: false,
            message: "Service Center Not Available",
          });
        }

        let slots_booked = scData.slots_booked
          ? JSON.parse(scData.slots_booked)
          : {};

        // Checking slot availability and updating it
        if (slots_booked[slotDate]) {
          if (slots_booked[slotDate].includes(slotTime)) {
            return res.json({
              success: false,
              message: "Slot Not Available, Select a diff slot",
            });
          } else {
            slots_booked[slotDate].push(slotTime);
          }
        } else {
          slots_booked[slotDate] = [slotTime];
        }

        // Fetch user data
        db.query(
          "SELECT user_id, full_name, user_email FROM users WHERE user_id = ?",
          [userId],
          (err, userDataResult) => {
            if (err) {
              console.error(err);
              //console.log('error : ', err);

              return res.json({ success: false, message: "this Server Error" });
            }

            if (userDataResult.length === 0) {
              return res.json({ success: false, message: "User Not Found" });
            }

            const userData = userDataResult[0];

            // Remove slots_booked from scData before storing
            delete scData.slots_booked;

            // Insert new booking

            //debugging
            // console.log("data : ",userId,
            //   sc_id,
            //   slotDate,
            //   slotTime,
            //   JSON.stringify(userData),
            //   JSON.stringify(scData),
            //   scData.fees);

            //                       console.log("scData:", scData);
            // console.log("scData.fees:", scData?.fees);

            const fees = scData?.fees || 1500; // Default to 1500 if undefined

            db.query(
              "INSERT INTO bookings (user_id, sc_id, slot_date, slot_time, user_data, sc_data, amount, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [
                userId,
                sc_id,
                slotDate,
                slotTime,
                JSON.stringify(userData),
                JSON.stringify(scData), // Now without slots_booked
                fees, //default value
                Date.now(),
              ],
              (err) => {
                if (err) {
                  console.error(err);
                  return res.json({
                    success: false,
                    message: "last Server Error",
                  });
                }

                // Update service center's booked slots
                db.query(
                  "UPDATE service_center SET slots_booked = ? WHERE sc_id = ?",
                  [JSON.stringify(slots_booked), sc_id],
                  (err) => {
                    if (err) {
                      console.error(err);
                      return res.json({
                        success: false,
                        message: "Error updating slot availability",
                      });
                    }
                    res.json({ success: true, message: "Slot Booked" });
                  }
                );
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Last Catch Error" });
  }
};

//Api to get user bookings for frontend user-booking page

const listBookings = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    // Fetch user bookings
    db.query(
      // "SELECT * FROM bookings WHERE user_id = ? ORDER BY slot_date DESC, slot_time DESC",
      "SELECT booking_id, user_id, sc_id, slot_date, slot_time, user_data, sc_data, amount, date, cancelled, is_completed, created_at, updated_at FROM bookings WHERE user_id = ? ORDER BY slot_date DESC, slot_time DESC",
      [userId],
      (err, bookingsResult) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }

        //checking
        //             console.log("Raw bookings result:", bookingsResult);  // Log the whole result
        // if (bookingsResult.length > 0) {
        //   console.log("First booking:", bookingsResult[0]); // Check first item in array
        // } else {
        //   console.log("No bookings found for user.");
        // }

        if (bookingsResult.length === 0) {
          return res.json({ success: true, bookings: [] }); // Return empty list if no bookings
        }

        // Parse service center & user data from JSON
        const bookings = bookingsResult.map((booking) => ({
          bookingId: booking.booking_id,
          serviceCenterId: booking.sc_id,
          slotDate: booking.slot_date,
          slotTime: booking.slot_time,
          amount: booking.amount,
          bookingDate: booking.date,
          status: booking.status || "pending", // Default to "pending" if status is missing
          cancelled: booking.cancelled, //  Added this
          isCompleted: booking.is_completed, //  Added this
          userData:
            typeof booking.user_data === "string"
              ? JSON.parse(booking.user_data)
              : booking.user_data,
          serviceCenterData:
            typeof booking.sc_data === "string"
              ? JSON.parse(booking.sc_data)
              : booking.sc_data,
        }));

        res.json({ success: true, bookings });
      }
    );
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//API to cancel a booking

const cancelBooking = async (req, res) => {
  try {
    const { userId, bookingId } = req.body;

    if (!userId || !bookingId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User ID and Booking ID are required",
        });
    }

    // Fetch booking details
    db.query(
      "SELECT * FROM bookings WHERE booking_id = ? AND user_id = ?",
      [bookingId, userId],
      (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({
              success: false,
              message: "Booking not found or unauthorized action",
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
              return res
                .status(500)
                .json({ success: false, message: "Failed to cancel booking" });
            }

            // Fetch service center slots
            db.query(
              "SELECT slots_booked FROM service_center WHERE sc_id = ?",
              [sc_id],
              (scErr, scResults) => {
                if (scErr) {
                  console.error("Error fetching service center:", scErr);
                  return res
                    .status(500)
                    .json({
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
                      return res
                        .status(500)
                        .json({
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

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookSlot,
  listBookings,
  cancelBooking,
};
