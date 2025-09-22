// import User from "../../model/users.model.js";
import User from "../model/users.model.js";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import cookieParser from "cookie-parser";
import { Book } from "../model/books.model.js";
import { Transaction } from "../model/transactions.model.js";

const register = async (req, res) => {
  try {
    const { fullname, username, password, gender, role, email } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json("User already exist");
    }
    let profilephotoUrl = null;
    if (req.file?.path) {
      const response = await uploadOnCloudinary(req.file.path);
      console.log(response);
      profilephotoUrl = response?.url;
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname: fullname,
      username: username,
      email: email,
      password: hashpassword,
      gender: gender,
      profilephoto: profilephotoUrl,
      role,
    });

    await newUser.save();

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);
    newUser.Refreshtoken = refreshToken;

    await newUser.save();

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie("AccessToken", accessToken, options);
    res.cookie("RefreshToken", refreshToken, options);

    console.log("response ", newUser);

    res.status(200).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        gender: newUser.gender,
        profilephoto: newUser.profilephotoUrl,
        role: newUser.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json("error", error);
    console.log(error);
  }
};

// *****Login******
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found please register" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid User or Password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.Refreshtoken = refreshToken;
    await user.save();
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie("AccessToken", accessToken, options);
    res.cookie("RefreshToken", refreshToken, options);
    const userData = await User.findOne({ email }).select(
      "-password -Refreshtoken "
    );
    res.status(201).json({
      message: "login successfully",
      userData,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    let incomingToken;
    if (req.headers.authorization) {
      incomingToken = req.headers.authorization?.split(" ")[1];
    }
    if (!incomingToken) {
      return res.status(401).json({ message: "Token is required" });
    }

    const user = await User.findOne({ Refreshtoken: incomingToken });
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.Refreshtoken = refreshToken;
    await user.save();
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie("AccessToken", accessToken, options);
    res.cookie("RefreshToken", refreshToken, options);
    res
      .status(201)
      .json({ message: "Login Successfully", user, accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal serer error" });
  }
};

const logout = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };
    res.clearCookie("AccessToken", options);
    res.clearCookie("RefreshToken", options);

    if (req.user) {
      const user = req.user;
      user.Refreshtoken = null;
      await user.save();
    }
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//****get all users*****
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -Refreshtoken");
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//****get one user****
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -Refreshtoken"
    );
    if (!user) {
      return res.status(400).json("User not found");
    }
    res.status(200).json({ message: "User fetched successfuly", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// In your user.contollers.js

const updateUser = async (req, res) => {
  try {
    // req.user is set by the verifyToken middleware
    const { id } = req.user;
    const { ...updateData } = req.body;

    // Handle profile photo upload
    if (req.file?.path) {
      const response = await uploadOnCloudinary(req.file.path);

      if (!response || !response.url) {
        return res
          .status(500)
          .json({ message: "Failed to upload new profile photo" });
      }

      // Update the profilephoto field in the updateData object
      updateData.profilephoto = response.url;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      select: "-password -Refreshtoken",
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const deleteuser = await User.findByIdAndDelete(id);
    if (!deleteuser) {
      return res.status(400).json("User not found");
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("author", "fullname email");

    res.status(200).json({
      message: "Books fetched successfully",
      books: books,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
};

const listOfBorrwedBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const borrowed = await Transaction.find({
      user_id: userId,
      returned: false,
    })
      .populate({
        path: "book_id",
        select: "name genre price author thumbnailphoto",
        populate: {
          path: "author", // author is also a User reference
          select: "fullname email",
        },
      })
      .populate("user_id", "fullname email"); // borrower details
    const numberOfBooks = borrowed.length;

    res.status(200).json({
      message: "Your Borrowed Books",
      numberOfBooks,
      borrowedBooks: borrowed,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
};

const listOfReturnedBooks = async (req, res) => {
  try {
    const userId = req.user._id;
    const returned = await Transaction.find({
      user_id: userId,
      returned: true,
    })
      .populate({
        path: "book_id",
        select: "name genre price author, thumbnailphoto",
        populate: {
          path: "author", // author is also a User reference
          select: "fullname email",
        },
      })
      .populate("user_id", "fullname email"); // borrower details

    res
      .status(200)
      .json({ message: "You Returned Books", returnedBooks: returned });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
};
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//sending otp to mail

const requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetpasswordOTP = otp;
    user.resetpasswordOTPexpiry = Date.now() + 10 * 1000 * 60;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "prabhasmadipadiga@gmail.com",
      subject: "Login OTP",
      html: `
        Hi <br>
        Your OTP is <b>${otp}</b>. It will expire in 10 minutes. </br>
        <br>Please do not share it with anyone.</br>
        <br>Team LibraryManagement</br>
      `,
    });
    res.status(201).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// reset new password

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resetpasswordOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetpasswordOTPexpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    user.resetpasswordOTP = null;
    user.resetpasswordOTPexpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(201).json({
      message: "Password updated successfully",
      name: user.fullname,
      email: user.email,
      role: user.role,
      gender: user.gender,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  register,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  refreshAccessToken,
  logout,
  getAllBooks,
  listOfBorrwedBooks,
  listOfReturnedBooks,
  requestResetPassword,
  resetPassword,
  updatePassword,
};
