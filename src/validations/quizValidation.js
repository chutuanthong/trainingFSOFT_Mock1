const Joi = require("joi");
const { CategoriesValidate, AnswerValidate } = require("./customValidation");

const createQuiz = {
  body: Joi.object()
    .keys({
      level: Joi.string()
        .trim()
        .lowercase()
        .required()
        .valid("easy", "medium", "hard"),
      category: Joi.string().trim().lowercase().required(),
      query: Joi.string().trim().lowercase().required(),
      answer: Joi.array().items(Joi.string().trim().lowercase()).required(),
      correctAnswer: Joi.string().trim().lowercase().required(),
    })
    .custom(AnswerValidate),
};

const getQuizzes = {
  query: Joi.object().keys({
    level: Joi.string().trim().lowercase().valid("easy", "medium", "hard"),
    category: Joi.string().trim().lowercase(),
    query: Joi.string().trim().lowercase(),
    answer: Joi.array().items(Joi.string().trim().lowercase()),
    correctAnswer: Joi.string().trim().lowercase(),

    sortBy: Joi.string().trim().lowercase(),
    order: Joi.string().trim().lowercase(),
    size: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getQuiz = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

const updateQuiz = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
  body: Joi.object()
    .keys({
      level: Joi.string()
        .trim()
        .lowercase()
        .optional()
        .valid("easy", "medium", "hard"),
      category: Joi.string()
        .trim()
        .lowercase()
        .optional()
        .lowercase()
        .custom(CategoriesValidate),
      query: Joi.string().trim().lowercase().optional(),
      answer: Joi.array()
        .items(Joi.string().trim().lowercase())
        .optional()
        .custom(AnswerValidate),
      correctAnswer: Joi.string().trim().lowercase().optional(),
    })
    .min(1),
};

const deleteQuiz = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};
const getExams = {
  query: Joi.object().keys({
    level: Joi.string()
      .trim()
      .lowercase()
      .valid("easy", "medium", "hard")
      .required(),
    category: Joi.string().trim().lowercase().required(),

    numberQuestion: Joi.number().integer().required(),
  }),
};

const submitAnswers = {
  body: Joi.object().keys({
    userId: Joi.number().integer().required(),
    count: Joi.number().integer().required(),
    rows: Joi.array()
      .items({
        id: Joi.number().required(),
        userAnswer: Joi.string().required(),
      })
      .required(),
  }),
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  getExams,
  submitAnswers,
};
