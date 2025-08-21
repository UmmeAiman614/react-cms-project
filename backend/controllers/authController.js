// backend/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import createError from "../utils/error-message.js";

const JWT_SECRET = "your_jwt_secret_here"; // use .env in production

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return next(createError(400, "All fields are required"));

    const existingUser = await User.findOne({ email });
    if (existingUser) return next(createError(400, "User already exists"));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "author",
    });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true }).status(201).json({
      success: true,
      user: { _id: newUser._id, name: newUser.name, role: newUser.role },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return next(createError(400, "All fields are required"));

    const user = await User.findOne({ email });
    if (!user) return next(createError(404, "User not found"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(createError(400, "Invalid credentials"));

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true }).status(200).json({
      success: true,
      user: { _id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(200).json({ user: null });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.status(200).json({ user });
  } catch (err) {
    res.status(200).json({ user: null });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").json({ success: true });
};
