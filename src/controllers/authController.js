const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");
// const { tokenTypes } = require('../config/tokens');
const response = require("../utils/responseTemp");

/**
 * Register an user
 */
const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.send(response(httpStatus.CREATED, "Register Success", { user }));
});

/**
 * Login an user and save refresh token into DB
 */
const login = catchAsync(async (req, res) => {
  const { email, password, deviceId } = req.body;
  const user = await authService.loginEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user, deviceId);
  res.send(
    response(httpStatus.OK, "Login Success", { user, tokens, deviceId })
  );
});

/**
 * Logout with refreshToken and deviceId
 */
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken, req.body.deviceId);
  res.send(response(httpStatus.OK, "Logout Success"));
});

/**
 * Refresh a token with refreshToken and deviceId
 */
const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuthSQL(
    req.body.refreshToken,
    req.body.deviceId
  );
  res.send(
    response(httpStatus.OK, "Refresh Token Success", { tokens: { ...tokens } })
  );
});

/**
 * Forgot password
 */
const forgotPassword = catchAsync(async (req, res) => {
  const randomPassword = Math.floor(100000 + Math.random() * 900000);
  await userService.updateUserByEmail(req.body.email, {
    password: randomPassword.toString(),
  });
  await emailService.sendResetPasswordEmail(req.body.email, randomPassword);
  res.send(response(httpStatus.OK, "Send New Password"));
});

/**
 * Send verification email
 */
const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user,
    req.body.deviceId
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.send(response(httpStatus.OK, "Send verification email success"));
});

/**
 * Verify email
 */
const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token, req.body.deviceId);
  res.send(response(httpStatus.OK, "Verification email success"));
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  sendVerificationEmail,
  verifyEmail,
};
