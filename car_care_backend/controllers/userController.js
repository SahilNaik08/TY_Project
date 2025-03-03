const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { connectDB } = require('../config/database');
const db = connectDB();

// API to register user
const registerUser = async (req, res) => {
  try {
    const { full_name, user_email, password } = req.body;

    // Checking for all required fields
    if (!full_name || !user_email || !password) {
      return res.status(400).json({ success: false, message: 'Missing Fields' });
    }

    // Validating email format
    if (!validator.isEmail(user_email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // Validating password strength
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Please enter a strong password (8+ characters)" });
    }

    // Hashing the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if user already exists
    const checkUserQuery = `SELECT user_id FROM users WHERE user_email = ?`;
    db.query(checkUserQuery, [user_email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }

      // Insert new user with default values for other fields
      const insertUserQuery = `
        INSERT INTO users (full_name, user_email, password, city, state, usr_img, address, phone, dob, gender) 
        VALUES (?, ?, ?, NULL, NULL, 'uploads_user_img/profile_pic.png', NULL, NULL, NULL, NULL)
      `;

      db.query(insertUserQuery, [full_name, user_email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ success: false, message: "Database error" });
        }

        // Get the inserted user's ID
        const userId = result.insertId;

        // Generate JWT token
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
          success: true,
          message: "User registered successfully",
          token,
          user: { user_id: userId, full_name, user_email, usr_img: 'uploads_user_img/profile_pic.png' }
        });
      });
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
                return res.status(500).json({ success: false, message: "Database error" });
            }

            if (results.length === 0) {
                return res.status(400).json({ success: false, message: "User does not exist" });
            }

            const user = results[0];

            // Compare hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: "Invalid credentials" });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({ success: true, token, user_id: user.user_id });
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


module.exports = { registerUser, loginUser };
