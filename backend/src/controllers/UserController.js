const userModel = require("../models/userModels");

const getUsers = async (_req, res) => {
  try {
    const users = await userModel.find().select("-password").sort({ name: 1 });
    return res.status(200).json({ success: true, users });
  } catch (e) {
    console.error("Error fetching users", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getUsers };
