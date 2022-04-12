const express = require("express");
const validate = require("../../middlewares/validate");
const auth = require("../../middlewares/auth");
const { quizValidation } = require("../../validations");
const { quizController } = require("../../controllers");

const router = express.Router();

router
  .route("/exams")
  .get(
    validate(quizValidation.getExams),
    quizController.convertCategoryId,
    quizController.getExams
  )
  .post(
    // auth("manageQuizzes"),
    validate(quizValidation.submitAnswers),
    quizController.submitAnswers
  );

router
  .route("/")
  .post(
    // auth("manageUsers"),
    validate(quizValidation.createQuiz),
    quizController.convertCategoryId,
    quizController.createQuiz
  )
  .get(
    // auth("getQuizzes"),
    validate(quizValidation.getQuizzes),
    quizController.convertCategoryId,
    quizController.getQuizzes
  );

router
  .route("/:id")
  .get(
    // auth("getQuizzes"),
    validate(quizValidation.getQuiz),
    quizController.getQuiz
  )
  .patch(
    // auth("manageQuizzes"),
    validate(quizValidation.updateQuiz),
    quizController.updateQuiz
  )
  .delete(
    // auth("manageQuizzes"),
    validate(quizValidation.deleteQuiz),
    quizController.deleteQuiz
  );

module.exports = router;
