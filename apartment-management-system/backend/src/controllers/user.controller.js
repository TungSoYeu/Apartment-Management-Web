const User = require("../models/User");

const generateToken = (id) => {
  return "mock_token_" + id;
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Tài khoản chưa được kích hoạt hoặc đã bị khóa.",
        });
      }

      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res
        .status(401)
        .json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { fullname, email, password, phone, identityCard } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email đã tồn tại" });
    }

    const user = await User.create({
      fullname,
      email,
      password,
      phone,
      identityCard,
      role: "RESIDENT",
      isActive: false, 
    });

    res.status(201).json({
      success: true,
      data: user,
      message: "Đăng ký thành công! Vui lòng chờ Admin duyệt.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approve = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isActive = true;
      await user.save();
      res.json({ success: true, message: "Đã duyệt cư dân thành công" });
    } else {
      res.status(404).json({ success: false, message: "User không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.update = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User không tồn tại" });
    }
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu cũ không đúng!" });
    }
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate("currentApartment");
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getUserById = async (req, res) => {
  try {
    
    if (
      req.user.role !== "ADMIN" &&
      req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem thông tin cư dân khác",
      });
    }

    const user = await User.findById(req.params.id).populate(
      "currentApartment",
    );
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: "User không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.params.id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User không tồn tại" });

   
    if (
      req.user.role !== "ADMIN" &&
      req.user._id.toString() !== user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Bạn không có quyền này" });
    }

    user.members.push({ name, phone });
    await user.save();
    res.json({
      success: true,
      message: "Thêm thành viên thành công",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.removeMember = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User không tồn tại" });

    if (
      req.user.role !== "ADMIN" &&
      req.user._id.toString() !== user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Bạn không có quyền này" });
    }

  
    user.members.pull(req.params.memberId);
    await user.save();
    res.json({ success: true, message: "Xóa thành viên thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.updateMember = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User không tồn tại" });

    if (
      req.user.role !== "ADMIN" &&
      req.user._id.toString() !== user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Bạn không có quyền này" });
    }

    const member = user.members.id(req.params.memberId);
    if (member) {
      member.name = name || member.name;
      member.phone = phone || member.phone;
      await user.save();
      res.json({ success: true, message: "Cập nhật thành công", data: user });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Thành viên không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
