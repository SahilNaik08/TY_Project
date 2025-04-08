const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");
const adminRouter = require("./routes/adminRoute");
const centerRouter = require("./routes/servCenterRoute");
const upload = require("./middlewares/multer");
const path = require("path");
const userRouter = require("./routes/userRoute");
const cron = require("node-cron");
const { sendBookingReminder } = require("./sendBookingReminder");

// app config
const app = express();

const port = process.env.PORT || 3000;

const db = connectDB().promise(); // Use promise-based connection

// midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use;
app.use(cors());

// CRON JOB: Runs every day at 9:00 AM
cron.schedule(
  "10 15 11 * * *",
  async () => {
    console.log("Running booking reminder check...");

    try {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);

      const formattedDate = `${tomorrow.getDate()}_${tomorrow.getMonth() + 1}_${tomorrow.getFullYear()}`;

      // 🔍 Fetch bookings for tomorrow
      const [bookings] = await db.query(
        "SELECT * FROM bookings WHERE slot_date = ?",
        [formattedDate]
      );
      console.log({ bookings });

      // Send reminders
      for (const booking of bookings) {
        await sendBookingReminder(
          booking.user_data.user_email,
          booking.slot_date,
          booking.slot_time
        );
      }

      console.log("Reminder emails sent successfully!");
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use("/uploads", express.static("uploads"));

// api endpoints

app.use("/api/admin", adminRouter);
app.use("/api/service-center", centerRouter);
app.use("/api/user", userRouter);
app.use("/test", (req, res) => {
  console.log("receiving");
});
app.get("/", (req, res) => {
  res.send("Express API working fine");
});

app.listen(port, () => console.log("Server started", port));
