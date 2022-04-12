const express = require("express");
const validate = require("../../middlewares/validate");
const authValidation = require("../../validations");
const { authController } = require("../../controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.register
);
router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", validate(authValidation.logout), authController.logout);
router.post(
  "/refresh-tokens",
  validate(authValidation.refreshTokens),
  authController.refreshTokens
);
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
// router.post(
//   "/send-verification-email",
//   auth(),
//   validate(authValidation.sendVerifyEmail),
//   authController.sendVerificationEmail
// );
// router.post(
//   "/verify-email",
//   validate(authValidation.verifyEmail),
//   authController.verifyEmail
// );

module.exports = router;
