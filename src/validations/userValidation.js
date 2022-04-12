const Joi = require("joi");
const { numberPhone } = require("./customValidation");

const createUser = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().required().email().lowercase(),
    password: Joi.string().required(),
    role: Joi.string().required().valid("user", "admin"),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    email: Joi.string().lowercase(),
    username: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    order: Joi.string(),
    size: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
  body: Joi.object()
    .keys({
      username: Joi.string().optional(),
      email: Joi.string().optional().email().lowercase(),
      password: Joi.string().optional(),
      // contact: Joi.string().optional().custom(numberPhone),
      role: Joi.string().optional().valid("user", "admin"),
      isEmailVerified: Joi.boolean().optional(),
      isContactVerified: Joi.boolean().optional(),
      isActive: Joi.boolean().optional(),
      lastScore: Joi.number().optional(),
      highScore: Joi.number().optional(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};
const changeContact = {
  body: Joi.object().keys({
    contact: Joi.string().required().custom(numberPhone),
  }),
};
const changeEmail = {
  body: Joi.object().keys({
    email: Joi.string().email().required().lowercase(),
  }),
};
const changePassword = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};
const changeUsername = {
  body: Joi.object().keys({
    username: Joi.string().required(),
  }),
};
const changeAvatar = {
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
};
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  changeContact,
  changeEmail,
  changePassword,
  changeUsername,
  changeAvatar,
};
