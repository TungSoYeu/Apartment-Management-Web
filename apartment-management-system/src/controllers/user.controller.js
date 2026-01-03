const userService = require("../services/user.service");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );
    res
      .status(200)
      .json({ success: true, token, user: { id: user._id, role: user.role } });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const user = await userService.registerResident(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

exports.approve = async (req, res, next) => {
  try {
    const user = await userService.approveResident(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
