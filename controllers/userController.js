require("dotenv").config();

const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
module.exports = {
  registerUser: asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
      const userExists = await User.findOne({ email });
      // check if user exists
      if (userExists) {
        res.status(400);
        throw new Error("User already exists");
      }
      // else create user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
      });
      if (user) {
        res.status(201).json({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          token: jwt.sign(
            { id: user._id},
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "1d",
            }
          ),
          isAdmin: user.isAdmin,
        });
      } else {
        res.status(400);
        throw new Error("invalid user data");
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  loginUser: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          isAdmin: user.isAdmin,
          token: jwt.sign(
            { id: user._id},
            process.env.JWT_SECRET_KEY,
            {
              expiresIn: "1d",
            }
          ),
        });
      } else {
        res.status(401);
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
      const user = await User.findById(req.user_.id);
      if (user && (await bcrypt.compare(oldPassword, user.password))) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: "Password Changed!" });
      } else {
        res.status(401);
        throw new Error("Invalid old password");
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  getLikedMovies: asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate("likedMovies");
      if (user) {
        res.json(user.likedMovies);
      } else {
        res.status(404);
        throw new Error("User not found");
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  addLikedMovie: asyncHandler(async (req, res) => {
    const { movieId } = req.body;
    try {
      const user = await User.findById(req.user._id);

      if (user) {
        if (user.likedMovies.includes(movieId)) {
          res.status(400);
          throw new Error("Movie already liked!");
        }
        user.likedMovies.push(movieId);
        await user.save();
        res.json(user.likedMovies);
      } else {
        res.status(404);
        throw new Error("Movie not found");
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),

  //@desc Delete all liked movies

  deleteLikedMovies: asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        user.likedMovies = [];
        await user.save();
        res.json({ message: "All liked movies deleted successfully" });
      } else {
        res.status(404);
        throw new Error("User not found");
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }),
  
};
