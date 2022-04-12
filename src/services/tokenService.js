const jwt = require("jsonwebtoken");
const moment = require("moment");
const httpStatus = require("http-status");
const config = require("../config/config");
const userService = require("./userService");
const { Token, Tokens } = require("../models");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {moment.Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save refresh token into SQL
 * @param {ObjectId} userId
 * @param {string} token
 * @param {Moment} expires
 * @param {string} deviceId
 * @returns {string}
 */
const saveRefreshTokenSQL = async (userId, token, expires, deviceId) => {
  const tokenDoc = await Tokens.create({
    userId,
    refreshToken: token,
    expires: expires.toDate(),
    deviceId,
  });
  return tokenDoc;
};

/**
 * Verify refresh token and return token doc (or throw an error if it is not valid)
 * @param {string} refreshToken
 * @param {string} deviceId
 * @returns {Promise<Token>}
 */
const verifyRefreshTokenSQL = async (refreshToken, deviceId) => {
  const payload = jwt.verify(refreshToken, config.jwt.secret);
  const userId = payload.sub;
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, "userID not found");
  }
  const tokenDoc = await Tokens.findOne({
    where: { userId, refreshToken, deviceId },
  });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
  }
  return tokenDoc;
};

/**
 * Verify email token and return token doc (or throw an error if it is not valid)
 * @param {string} refreshToken
 * @param {string} deviceId
 * @returns {Promise<Token>}
 */
const verifyEmailToken = async (verifyEmailToken, deviceId) => {
  const payload = jwt.verify(verifyEmailToken, config.jwt.secret);
  const userId = payload.sub;
  if (!userId) {
    throw new ApiError(httpStatus.NOT_FOUND, "userID not found");
  }
  const tokenDoc = await Tokens.findOne({
    where: { userId, verifyEmailToken, deviceId },
  });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
  }
  return tokenDoc;
};
/**
 * Generate auth tokens and save into DB
 * @param {Object} user
 * @param {string} deviceId
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user, deviceId) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  console.log("accessTokenExpires: ", accessTokenExpires.format("YYYY MM DD"));
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    "days"
  );
  console.log(
    "refreshTokenExpires: ",
    refreshTokenExpires.format("YYYY MM DD")
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  const tokenDoc = await userService.getTokenByUserIdAndDeviceId(
    user.id,
    deviceId
  );
  if (!tokenDoc) {
    //create new Token
    await saveRefreshTokenSQL(
      user.id,
      refreshToken,
      refreshTokenExpires,
      deviceId
    );
  } else {
    //update Token
    await userService.updateRefreshTokenByUserIdAndDeviceId(
      user.id,
      deviceId,
      refreshToken,
      refreshTokenExpires
    );
  }

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} userName
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (userName) => {
  const user = await userService.getUserByUsername(userName);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );
  const resetPasswordToken = generateToken(
    user.userID,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveRefreshTokenSQL(
    resetPasswordToken,
    user.userID,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  return resetPasswordToken;
};

/**
 * Save email token into SQL
 * @param {ObjectId} userId
 * @param {string} token
 * @param {Moment} expires
 * @param {string} deviceId
 * @returns {string}
 */
const saveEmailToken = async (userId, token, expires, deviceId) => {
  const tokenDoc = await Tokens.create({
    userId,
    verifyEmailToken: token,
    deviceId,
  });
  return tokenDoc;
};
/**
 * Generate verify email token
 */
const generateVerifyEmailToken = async (user, deviceId) => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    "minutes"
  );
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  const tokenDoc = await userService.getTokenByUserIdAndDeviceId(
    user.id,
    deviceId
  );
  if (!tokenDoc) {
    //create new Token
    await saveEmailToken(user.id, verifyEmailToken, expires, deviceId);
  } else {
    //update Token
    await userService.updateEmailTokenByUserIdAndDeviceId(
      user.id,
      deviceId,
      verifyEmailToken
    );
  }
  return verifyEmailToken;
};

/**
 * Generate phone token
 * @param {ObjectId} userId
 * @param {String} code
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generatePhoneToken = (
  userId,
  code,
  expires,
  type,
  secret = config.jwt.secret
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
    code,
  };
  return jwt.sign(payload, secret);
};

module.exports = {
  generateToken,
  saveRefreshTokenSQL,
  verifyRefreshTokenSQL,
  verifyEmailToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
