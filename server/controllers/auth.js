const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const { Token } = require('../models/token');
const mailSender = require('../helpers/email_sender');

const { validationResult } = require('express-validator'); // Import express-validator

exports.register = async function (req, res) {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.param, // The field name
      message: error.msg, // The user-friendly error message
    }));
    return res.status(400).json({ errors: errorMessages });
  }

  try {
    let user = new User({
      ...req.body,
      passwordHash: bcrypt.hashSync(req.body.password, 8),
    });
    user = await user.save();
    if (!user) {
      return res.status(500).json({ message: 'Could not create a new user' });
    }
    user.passwordHash = undefined;
    return res.status(201).json(user);
  } catch (err) {
    if (err.message.includes('email_1 dup key')) {
      return res.status(409).json({
        type: 'AuthError',
        message: 'User with that email already exists!.',
      });
    }
    return res.status(500).json({ type: err.name, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // we don't exclude the password hash here, because we will use it in the bcrypt.compareSync
    // we will remove it after
    const user = await User.findOne({ email }).select('-cart');
    if (!user) {
      return (
        res
          .status(404)
          // email enumeration is a security risk, so we don't want to give the user a
          // hint that the email is the problem
          // .json({ message: 'User not found!\nCheck your email and try again' });
          .json({ message: 'Incorrect email or password!' })
      );
    }
    if (bcrypt.compareSync(password, user.passwordHash)) {
      const accessToken = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '24h',
        }
      );

      const refreshToken = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: '60d',
        }
      );

      const token = await Token.findOne({ userId: user.id });
      if (token) await token.deleteOne();
      await new Token({ userId: user.id, accessToken, refreshToken }).save();

      user.passwordHash = undefined;
      return res.json({ ...user._doc, accessToken, refreshToken });
    }
    // we don't want to give the user a hint that the password is the problem
    // return res.status(400).json({ message: 'Incorrect password!' });
    return res.status(400).json({ message: 'Incorrect email or password!' });
  } catch (err) {
    return res.status(500).json({ type: err.name, message: err.message });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    let accessToken = req.headers.authorization;
    console.info('VERIFY TOKEN: ', accessToken);
    if (!accessToken) return res.json(false);
    accessToken = accessToken.replace('Bearer', '').trim();
    const token = await Token.findOne({ accessToken });
    if (!token) return res.json(false);

    console.log('FOUND TOKEN IN DB', token.accessToken);
    const tokenData = jwt.decode(token.refreshToken);

    const user = await User.findById(tokenData.id);
    if (!user) return res.json(false);

    console.log('USER FOUND');
    const isValid = jwt.verify(
      token.refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    if (!isValid) return res.json(false);
    console.log('TOKEN IS STILL VALID');
    return res.json(true);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Tìm user bằng email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User with that email does NOT exist' });
    }

    // Tạo mã OTP ngẫu nhiên gồm 4 chữ số
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Lưu mã OTP và thời gian hết hạn vào cơ sở dữ liệu
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 600000; // OTP hết hạn sau 10 phút

    await user.save();

    // Mẫu email HTML
    const otpEmailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset OTP</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 20px;
                  color: #333;
              }
              .container {
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                  max-width: 600px;
                  margin: 0 auto;
              }
              .header {
                  text-align: center;
                  margin-bottom: 20px;
              }
              .header h2 {
                  color: #6c63ff;
              }
              .otp-code {
                  font-size: 24px;
                  font-weight: bold;
                  color: #ff6b6b;
                  text-align: center;
                  margin: 20px 0;
              }
              .message {
                  font-size: 16px;
                  line-height: 1.5;
              }
              .footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 14px;
                  color: #999;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>Password Reset Request</h2>
              </div>
              <div class="message">
                  <p>Dear User,</p>
                  <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to complete the process. This OTP is valid for the next 10 minutes:</p>
              </div>
              <div class="otp-code">${otp}</div>
              <div class="message">
                  <p>If you did not request a password reset, please ignore this email or contact support if you have any concerns.</p>
                  <p>Thank you for using our service!</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 Your Company. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    // Gửi email chứa OTP
    await mailSender.sendMail(
      email,
      'Password Reset OTP',
      otpEmailTemplate,
      'Password reset OTP sent to your email',
      'Error sending email'
    );

    return res.status(200).json({ message: 'Password reset OTP sent to your email' });
  } catch (error) {
    console.error('Reset Password error:', error);
    return res.status(500).json({ type: error.name, message: error.message });
  }
};
exports.verifyPasswordResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the OTP and its expiration time are valid
    if (
      user.resetPasswordOtp !== +otp ||
      Date.now() > user.resetPasswordOtpExpires
    ) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    // Reset the user's OTP fields
    user.resetPasswordOtp = 1;
    user.resetPasswordOtpExpires = undefined;

    await user.save();

    return res.json({ message: 'OTP confirmed successfully' });
  } catch (error) {
    console.error('Reset Password error:', error);
    return res.status(500).json({ type: error.name, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find the user with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the OTP and its expiration time are valid
    if (user.resetPasswordOtp !== 1) {
      return res
        .status(401)
        .json({ message: 'Confirm OTP before resetting password' });
    }

    // Reset the user's password
    user.passwordHash = bcrypt.hashSync(newPassword, 8);

    // Reset the user's OTP fields
    user.resetPasswordOtp = undefined;

    await user.save();

    return res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset Password error:', error);
    return res.status(500).json({ type: error.name, message: error.message });
  }
};
