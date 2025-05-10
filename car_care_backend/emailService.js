require("dotenv").config();
const { createTransport } = require("nodemailer");

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    
  },
});

const sendBookingReminder = async (userEmail, date, time) => {
  try {
    await transporter.sendMail({
      from: "sahilnaik2150@gmail.com",
      to: userEmail,
      subject: `Booking Reminder`,
      text: `Hi ${userEmail},\n\nThis is a reminder for your booking on ${date} at ${time}.\n\nThank you!`,
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const sendBookingCancelledEmail = async (userEmail, bookingId) => {
  try {
    await transporter.sendMail({
      from: "sahilnaik2150@gmail.com",
      to: userEmail,
      subject: `Booking Cancelled - ID: ${bookingId}`,
      text: `Hi ${userEmail},\n\nWe're sorry to inform you that your booking with ID ${bookingId} has been cancelled by the service center.\nWe apologize for the inconvenience.\n\nThank you for your understanding.`,
    });
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};

const sendBookingCompletedEmail = async (userEmail, bookingId) => {
  try {
    await transporter.sendMail({
      from: "sahilnaik2150@gmail.com",
      to: userEmail,
      subject: `Booking Completed - ID: ${bookingId}`,
      text: `Hi ${userEmail},\n\nYour car servicing for booking ID ${bookingId} has been completed. You can now pick up your vehicle.\n\nThank you for choosing us!`,
    });
    return true;
  } catch (error) {
    console.error("Email error:", error);
    return false;
  }
};

module.exports = {
  sendBookingReminder,
  sendBookingCancelledEmail,
  sendBookingCompletedEmail,
};
