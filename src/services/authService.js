const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tokenService = require("./tokenService");
const userService = require("./userService");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");
const { Tokens } = require("../models");
const config = require("../config/config");

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise}
 */
const loginEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email.toLowerCase());
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No user found with that email");
  }
  const isPasswordCorrect = await user.checkPassword(password, user.password);
  if (!user || !isPasswordCorrect) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

/**
 * Logout with refreshToken and deviceId
 * @param {string} refreshToken
 * @param {string} deviceId
 * @returns {Promise}
 */
const logout = async (refreshToken, deviceId) => {
  const tokenDoc = await Tokens.findOne({ where: { refreshToken, deviceId } });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await tokenDoc.destroy();
};

/**
 * Refresh auth token with refreshToken and deviceId
 * @param {string} refreshToken
 * @param {string} deviceId
 * @returns {Promise}
 */
const refreshAuthSQL = async (refreshToken, deviceId) => {
  try {
    const tokenDoc = await tokenService.verifyRefreshTokenSQL(
      refreshToken,
      deviceId
    );
    const user = await userService.getUserByPk(tokenDoc.userId);
    if (!user) {
      throw new Error();
    }
    await tokenDoc.destroy();
    return tokenService.generateAuthTokens(user, deviceId);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Reset password
 */
const resetPasswordSQL = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyTokenSQL(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await userService.getUserByPk(resetPasswordTokenDoc.userID);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserByPk(user.userID, { passWord: newPassword });
    await Tokens.destroy({
      where: { userID: user.userID, type: tokenTypes.RESET_PASSWORD },
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

/**
 * Verify email
 */
const verifyEmail = async (verifyEmailToken, deviceId) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyEmailToken(
      verifyEmailToken,
      deviceId
    );
    const user = await userService.getUserByPk(verifyEmailTokenDoc.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    await userService.updateEmailTokenByUserIdAndDeviceId(
      user.id,
      deviceId,
      null
    );
    await userService.updateUserByPk(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

module.exports = {
  loginEmailAndPassword,
  logout,
  refreshAuthSQL,
  resetPasswordSQL,
  verifyEmail,
};
