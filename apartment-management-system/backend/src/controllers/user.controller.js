const User = require("../models/User");

// Hàm tạo token giả lập (Bạn có thể thay bằng JWT thật sau này)
const generateToken = (id) => {
  return "mock_token_" + id;
};

// 1. Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm user và lấy luôn field password (vì mặc định select: false nếu cấu hình trong model)
    const user = await User.findOne({ email });

    // Kiểm tra user có tồn tại và khớp mật khẩu không
    // Sử dụng hàm matchPassword đã định nghĩa trong Model User.js
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

// 2. Đăng ký cư dân (Resident)
exports.register = async (req, res) => {
  try {
    const { fullname, email, password, phone, identityCard } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email đã tồn tại" });
    }

    // Khi create, pre('save') trong Model sẽ tự động mã hóa password
    const user = await User.create({
      fullname,
      email,
      password,
      phone,
      identityCard,
      role: "RESIDENT",
      isActive: false, // Cần admin duyệt
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

// 3. Duyệt cư dân (Approve) - Chỉ Admin
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

// 4. Cập nhật thông tin User
exports.update = async (req, res) => {
  try {
    // Không cho phép update password qua route này để đảm bảo an toàn
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Đổi mật khẩu (Sửa lỗi so sánh password cũ)
exports.changePassword = async (req, res) => {
  try {
    // Lấy userId từ middleware protect (req.user đã được gán ở auth.middleware)
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User không tồn tại" });
    }

    // Kiểm tra mật khẩu cũ có đúng không (dùng hàm matchPassword của model)
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu cũ không đúng!" });
    }

    // Gán mật khẩu mới và lưu lại (pre('save') sẽ tự động mã hóa)
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// 6. Lấy tất cả user (Admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).populate("currentApartment");
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Lấy user theo ID
exports.getUserById = async (req, res) => {
  try {
    // KIỂM TRA QUYỀN: Nếu không phải Admin và ID muốn xem không trùng với ID bản thân -> Chặn
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
// 8. Thêm thành viên vào hộ gia đình
exports.addMember = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findById(req.params.id);

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User không tồn tại" });

    // KIỂM TRA QUYỀN: Phải là Admin hoặc chính chủ hộ đó
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

// 9. Xóa thành viên
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

    // Sử dụng pull để xóa thành viên khỏi mảng
    user.members.pull(req.params.memberId);
    await user.save();
    res.json({ success: true, message: "Xóa thành viên thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 10. Cập nhật thông tin thành viên
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
