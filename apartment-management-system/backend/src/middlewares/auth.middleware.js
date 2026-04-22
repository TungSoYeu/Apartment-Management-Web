const User = require("../models/User");
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      let userId;
      if (token.startsWith("mock_token_")) {
        userId = token.replace("mock_token_", "");
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Token không hợp lệ" });
      }

      req.user = await User.findById(userId).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "User không tồn tại" });
      }

      next();
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: "Not authorized, no token" });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user ? req.user.role : "Unknown"} is not authorized to access this route`,
      });
    }
    next();
  };
};
