const { connectDB } = require("../config/database.js");

const db = connectDB();

// SQL query to create the 'service_center' table
const createServiceCenterTable = `
  CREATE TABLE IF NOT EXISTS service_center (
    sc_email VARCHAR(25) PRIMARY KEY,
    sc_name VARCHAR(25) NOT NULL,
    image VARCHAR(25) NOT NULL,
    serviceType VARCHAR(25) NOT NULL,
    city VARCHAR(25) NOT NULL,
    state VARCHAR(25) NOT NULL,
    password VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

// Create the table
db.query(createServiceCenterTable, (err, result) => {
  if (err) {
    console.error("Error creating service_centers table:", err.message);
  } else {
    console.log("Service centers table created or already exists.");
  }
});

module.exports = db; // Export the connection for use in other files
