const httpStatus = require("http-status");
// const bcrypt = require("bcryptjs");
const { Users, Tokens } = require("../models");
// const paginationService = require("./paginationService");
const ApiError = require("../utils/ApiError");
// const { authService } = require(".");

/**
 * Create an user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  userBody.email = userBody.email.toLowerCase();
  if (await Users.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email address already in use!");
  }
  if (userBody.contact && (await Users.isContactTaken(userBody.contact))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Contact already in use!");
  }
  return Users.create({ ...userBody });
};

// /**
//  * Query user
//  * @param {Object} filter
//  * @param {Object} options
//  * @returns {Promise<User>}
//  */
// const queryUsers = async (filter, options) => {
//   const page = parseInt(options.page, 10);
//   const size = parseInt(options.size, 10);
//   const { limit, offset } = paginationService.getPagination(page, size);
//   if (!options.sortBy) options.sortBy = "createdAt";
//   if (!options.order) options.order = "desc";
//   const data = await Users.findAndCountAll({
//     where: filter,
//     limit,
//     offset,
//     order: [[options.sortBy, options.order]],
//     attributes: { exclude: ["password"] },
//   });
//   if (!data) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Users not found");
//   }
//   const users = paginationService.getPagingData(data, page, limit);
//   return users;
// };

const getUserByPk = async (id) => Users.findByPk(id);
// return Users.findOne({ where: { id }, attributes: { exclude: ['password'] } });
/**
 * Get user by email
 */
const getUserByEmail = async (_email) =>
  // return Users.findOne({ where: { email: _email }, attributes: { exclude: ['password'] } });
  Users.findOne({ where: { email: _email } });
// /**
//  * Update user by pk
//  * @param {ObjectId} userId
//  * @param {Object} updateBody
//  * @returns {Promise<User>}
//  */
// const updateUserByPk = async (userId, updateBody) => {
//   const user = await getUserByPk(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found");
//   }
//   if (updateBody.email && (await Users.isEmailTaken(updateBody.email))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Email address already in use!");
//   }
//   if (updateBody.contact && (await Users.isContactTaken(updateBody.contact))) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Contact already in use!");
//   }
//   Object.assign(user, updateBody);
//   await user.save();
//   return user;
// };

/**
 * Update user by email
 * @param {string} email
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserByEmail = async (email, updateBody) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // if (updateBody.email && (await Users.isEmailTaken(updateBody.email))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Email address already in use!");
  // }
  // if (updateBody.contact && (await Users.isContactTaken(updateBody.contact))) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Contact already in use!");
  // }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

// /**
//  * Delete user by Pk
//  */
// const deleteUserByPk = async (userId) => {
//   const user = await getUserByPk(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found");
//   }
//   await user.destroy();
//   return user;
// };
// /**
//  * Update password by pk
//  * @param {ObjectId} userId
//  * @param {Object} body
//  * @returns {Promise<User>}
//  */
// const changePasswordByPk = async (userId, body) => {
//   const user = await getUserByPk(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found");
//   }
//   const isOldPasswordCorrect = await user.checkPassword(
//     body.oldPassword,
//     user.password
//   );
//   if (!isOldPasswordCorrect) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Old password is not correct");
//   }
//   user.password = body.newPassword;
//   await user.save();
//   return user;
// };

/**
 * Get userRole by userId
 * @param {Number} id
 * @param {string} deviceId
 * @returns {Promise<Tokens>}
 */
const getTokenByUserIdAndDeviceId = async (id, deviceId) =>
  Tokens.findOne({ where: { userId: id, deviceId } });

/**
 * Update refreshToken by userId and deviceId
 * @param {Number} id
 * @param {string} deviceId
 * @param {String}token
 * @param {Date} refreshTokenExpires
 * @returns {Promise<Tokens>}
 */
const updateRefreshTokenByUserIdAndDeviceId = async (
  id,
  deviceId,
  token,
  refreshTokenExpires
) => {
  const tokenDoc = await getTokenByUserIdAndDeviceId(id, deviceId);
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
  }
  tokenDoc.refreshToken = token;
  tokenDoc.expires = refreshTokenExpires;
  await tokenDoc.save();
  return tokenDoc;
};
/**
 * Update email token by userId and deviceId
 * @param {Number} id
 * @param {string} deviceId
 * @param token
 * @returns {Promise<Tokens>}
 */
const updateEmailTokenByUserIdAndDeviceId = async (id, deviceId, token) => {
  const tokenDoc = await getTokenByUserIdAndDeviceId(id, deviceId);
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
  }
  tokenDoc.verifyEmailToken = token;
  await tokenDoc.save();
  return tokenDoc;
};

module.exports = {
  createUser,
  // queryUsers,
  getUserByPk,
  getUserByEmail,
  // updateUserByPk,
  // deleteUserByPk,
  // changePasswordByPk,
  getTokenByUserIdAndDeviceId,
  updateRefreshTokenByUserIdAndDeviceId,
  updateEmailTokenByUserIdAndDeviceId,
  updateUserByEmail,
};
