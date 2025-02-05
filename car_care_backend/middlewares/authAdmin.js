const jwt = require("jsonwebtoken");

// Admin authentication middleware
const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;

    // If token is not there
    if (!atoken) {
      return res.json({ success: false, message: "Not authorized, login again" });
    }

    // If token exists
    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    // To check if decoded token is valid
    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({ success: false, message: "Not authorized, login again" });
    }

    // If token is valid
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Export as CommonJS module
module.exports = authAdmin;
