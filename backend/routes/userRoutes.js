const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// In-memory OTP store (use Redis in production)
const otpStore = new Map();

/* =========================
   EMAIL CONFIG
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: "Email or phone number is required" });
    }

    // Check if user already exists
    let existingUser;
    if (email) {
      existingUser = await User.findOne({ email });
    }
    if (!existingUser && phone) {
      existingUser = await User.findOne({ phone });
    }

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const userData = {
      name: name || "User",
      address,
    };

    if (email) userData.email = email;
    if (phone) userData.phone = phone;
    if (password) userData.password = password;

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

/* =========================
   SEND OTP (Email or Phone)
========================= */
router.post("/send-otp", async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res
        .status(400)
        .json({ message: "Email or phone number is required" });
    }

    const identifier = email || phone;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(identifier, {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
      type: email ? "email" : "phone",
    });

    // Send OTP via email
    if (email) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Your Productr OTP",
          text: `Your OTP is ${otp}. Valid for 5 minutes.`,
          html: `<p>Your OTP is <strong>${otp}</strong>. Valid for 5 minutes.</p>`,
        });
      } catch (emailError) {
        console.error("Email send error:", emailError);
        // Continue even if email fails (for development)
      }
    }

    // Send OTP via SMS (mock - replace with Twilio or similar in production)
    if (phone) {
      console.log(`📱 OTP for ${phone}: ${otp}`);
      console.log(
        `💡 In production, integrate Twilio or similar SMS service here`
      );
      // In production, use Twilio or similar:
      // const twilio = require('twilio');
      // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      // await client.messages.create({
      //   body: `Your Productr OTP is ${otp}. Valid for 5 minutes.`,
      //   to: phone,
      //   from: process.env.TWILIO_PHONE_NUMBER
      // });
    }

    res.json({
      success: true,
      message: `OTP sent successfully to ${email ? "email" : "phone"}`,
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* =========================
   VERIFY OTP (Email or Phone)
========================= */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    const identifier = email || phone;
    if (!identifier) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    const record = otpStore.get(identifier);
    if (!record) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (Date.now() > record.expires) {
      otpStore.delete(identifier);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    otpStore.delete(identifier);

    // Find or create user
    let user;
    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          email,
          name: email.split("@")[0] || "User",
        });
      }
    } else if (phone) {
      user = await User.findOne({ phone });
      if (!user) {
        user = await User.create({
          phone,
          name: "User",
        });
      }
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
});

module.exports = router;
