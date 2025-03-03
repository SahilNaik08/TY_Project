const { connectDB } = require('../config/database'); // Import the database connection

const db = connectDB(); // Get the MySQL connection

// SQL query to create the 'users' table
const createUserTable = `
  CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(55) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    city VARCHAR(15) DEFAULT '',
    state VARCHAR(15) DEFAULT '',
    usr_img VARCHAR(255) NOT NULL DEFAULT 'uploads_user_img/profile_pic.png',
    address VARCHAR(255) DEFAULT '',
    phone VARCHAR(15) UNIQUE DEFAULT '',
    dob DATE DEFAULT NULL,
    gender ENUM('male', 'female') DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

// Create the table
db.query(createUserTable, (err, result) => {
  if (err) {
    console.error('Error creating users table:', err.message);
  } else {
    console.log('Users table created or already exists.');
  }
});

module.exports = db; // Export the connection for use in other files
