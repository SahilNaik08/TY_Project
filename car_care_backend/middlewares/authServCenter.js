const jwt = require("jsonwebtoken");

// Serv Center authentication middleware
const authServCenter = async (req, res, next) => {
  try {
    const { sctoken } = req.headers;

    // If token is not there
    if (!sctoken) {
      return res.json({ success: false, message: "Not authorized, login again" });
    }

    // If token exists
    const token_decode = jwt.verify(sctoken, process.env.JWT_SECRET);

    req.body.service_center_email  = token_decode.email;
    // If token is valid
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Export as CommonJS module
module.exports = authServCenter;
