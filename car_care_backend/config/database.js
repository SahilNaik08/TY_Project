import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

export const connectDB = () => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'car_care',
  });

  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err.message);
      process.exit(1); // Exit process with failure
    }
    console.log('Connected to MySQL database successfully!');
  });

  return connection;
};
