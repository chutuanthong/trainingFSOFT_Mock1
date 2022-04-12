const express = require("express");
const validate = require("../../middlewares/validate");
const { categoryValidation } = require("../../validations");
const { categoryController } = require("../../controllers");

const router = express.Router();

router
  .route("/")
  .post(
    // auth("manageCategories"),
    validate(categoryValidation.createCategory),
    categoryController.createCategory
  )
  .get(
    // auth("getCategories"),
    validate(categoryValidation.getCategories),
    categoryController.getCategories
  );

router
  .route("/:id")
  .get(
    // auth("getCategories"),
    validate(categoryValidation.getCategory),
    categoryController.getCategory
  )
  .patch(
    // auth("manageCategories"),
    validate(categoryValidation.updateCategory),
    categoryController.updateCategory
  )
  .delete(
    // auth("manageCategories"),
    validate(categoryValidation.deleteCategory),
    categoryController.deleteCategory
  );

module.exports = router;
