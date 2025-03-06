const jwt = require("jsonwebtoken");

// User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    // If token is not there
    if (!token) {
      return res.json({ success: false, message: "Not authorized, login again" });
    }

    // If token exists
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    req.body.userId = token_decode.id;
    // If token is valid
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Export as CommonJS module
module.exports = authUser;
