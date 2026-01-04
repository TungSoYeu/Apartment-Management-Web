const User = require("../models/User");

// Middleware xác thực đăng nhập
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Ở môi trường dev/demo, ta dùng giả lập token hoặc lấy ID từ token giả
      // Nếu bạn dùng JWT thật: const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // GIẢ LẬP: Token dạng "mock_token_IDUSER"
      // Nếu bạn dùng JWT thật, hãy thay đoạn logic này
      let userId;
      if (token.startsWith("mock_token_")) {
        userId = token.replace("mock_token_", "");
      } else {
        // Fallback nếu logic token khác
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

// Middleware phân quyền (Admin, Accountant...)
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
