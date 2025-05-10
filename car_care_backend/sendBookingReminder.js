require("dotenv").config();
const { createTransport } = require("nodemailer");

const sendBookingReminder = async (userEmail, date, time) => {
  try {
    const transporter = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        // Your email password or app-specific password
              },
    });

    await transporter.sendMail({
      from: "sahilnaik2150@gmail.com",
      to: userEmail,
      subject: `Booking reminder`,
      text: `Hi ${userEmail},\n\nThis is a reminder for your booking on ${date} at ${time}.\n\nThank you!`,
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

module.exports = { sendBookingReminder };
