const { connectDB } = require('../config/database'); // Import the database connection

const db = connectDB(); // Get the MySQL connection

// SQL query to create the 'bookings' table
const createBookingTable = `
  CREATE TABLE IF NOT EXISTS bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sc_id INT NOT NULL,
    slot_date VARCHAR(20) NOT NULL,
    slot_time VARCHAR(20) NOT NULL,
    user_data JSON NOT NULL,
    sc_data JSON NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date BIGINT NOT NULL,
    cancelled TINYINT(1) DEFAULT 0,  
    is_completed TINYINT(1) DEFAULT 0,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (sc_id) REFERENCES service_center(sc_id) ON DELETE CASCADE
  )
`;

// Create the table
db.query(createBookingTable, (err, result) => {
  if (err) {
    console.error('Error creating bookings table:', err.message);
  } else {
    console.log('Bookings tabke connection working.');
  }
});

module.exports = db; 