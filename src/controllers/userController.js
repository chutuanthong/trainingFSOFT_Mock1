// const httpStatus = require("http-status");
// const pick = require("../utils/pick");
// const ApiError = require("../utils/ApiError");
// const catchAsync = require("../utils/catchAsync");
// const { userService } = require("../services");
// const response = require("../utils/responseTemp");
const Factory = require("./factoryController");
const User = require("../models/Users");

// /**
//  * Get own user
//  */
// const getMyProfile = catchAsync(async (req, res) => {
//   const user = await userService.getUserByPk(req.user.id);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found");
//   }
//   res.send(response(httpStatus.OK, "Get profile success", user));
// });

// /**update an user
//  */
// const updateUser = catchAsync(async (req, res) => {
//   const user = await userService.updateUserByPk(req.user.id, req.body);
//   res.send(response(httpStatus.OK, "Change contact success", user));
// });

// /**
//  * Change contact by own user
//  */
// const changeContact = catchAsync(async (req, res) => {
//   const user = await userService.updateUserByPk(req.user.id, req.body);
//   res.send(response(httpStatus.OK, "Change contact success", user));
// });

// /**
//  * Change email by own user
//  */
// const changeEmail = catchAsync(async (req, res) => {
//   const user = await userService.updateUserByPk(req.user.id, req.body);
//   res.send(response(httpStatus.OK, "Change email success", user));
// });

// /**
//  * Change password by own user
//  */
// const changePassword = catchAsync(async (req, res) => {
//   const user = await userService.changePasswordByPk(req.user.id, req.body);
//   res.send(response(httpStatus.OK, "Change password success", user));
// });

// /**
//  * Change username by own user
//  */
// const changeUsername = catchAsync(async (req, res) => {
//   const user = await userService.updateUserByPk(req.user.id, req.body);
//   res.send(response(httpStatus.OK, "Change username success", user));
// });

// /**
//  * Change avatar by own user
//  */
// const changeAvatar = catchAsync(async (req, res) => {
//   const user = await userService.updateUserByPk(req.user.id, req.body);
//   res.send(response(httpStatus.OK, "Change avatar success", user));
// });

// /**
//  * Get own tokens
//  */
// const getOwnTokens = catchAsync(async (req, res) => {
//   const user = await userService.getUserByPk(req.user.id);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, "User not found");
//   }
//   const tokens = await userService.getAllTokenByUserId(req.user.id);
//   res.send(response(httpStatus.OK, "Get tokens success", tokens));
// });

const createUser = Factory.createOne(User);

const getUsers = Factory.getAll(
  User,
  ["email", "username", "role"],
  ["password"]
);

const getUser = Factory.getOne(User);

const updateUser = Factory.updateOne(User);

const deleteUser = Factory.deleteOne(User);

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  // getMyProfile,
  // changeContact,
  // changeEmail,
  // changePassword,
  // changeUsername,
  // changeAvatar,
  // getOwnTokens,
};
