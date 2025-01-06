import connectDB from '../config/database'; // Import the database connection

const db = connectDB(); // Get the MySQL connection

// SQL query to create the 'users' table
const createUserTable = `
  CREATE TABLE IF NOT EXISTS users (
    user_email VARCHAR(55) AUTO_INCREMENT PRIMARY KEY UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    city VARCHAR(15) NOT NULL,
    state VARCHAR(15) NOT NULL,
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

export default db; // Export the connection for use in other files
