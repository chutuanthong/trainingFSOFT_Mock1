const httpStatus = require("http-status");
const Factory = require("./factoryController");
const { Quizzes } = require("../models");
const catchAsync = require("../utils/catchAsync");
const { categoryService, quizService, userService } = require("../services");
const ApiError = require("../utils/ApiError");
const pick = require("../utils/pick");
const response = require("../utils/responseTemp");

const convertCategoryId = catchAsync(async (req, res, next) => {
  if (req.body.category) {
    const category = await categoryService.findByName(req.body.category);
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, "This category does not exist");
    }
    req.body.categoryId = category.id;
  }

  if (req.query.category) {
    const category = await categoryService.findByName(req.query.category);
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, "This category does not exist");
    }
    req.query.categoryId = category.id;
  }

  next();
});

const createQuiz = Factory.createOne(Quizzes);

const getQuizzes = Factory.getAll(
  Quizzes,
  ["level", "categoryId"],
  ["password"]
);

const getQuiz = Factory.getOne(Quizzes);

const updateQuiz = Factory.updateOne(Quizzes);

const deleteQuiz = Factory.deleteOne(Quizzes);

const getExams = catchAsync(async (req, res, next) => {
  const filter = pick(req.query, ["level", "categoryId"]);

  const data = await Quizzes.findAndCountAll({
    where: filter,
    attributes: { exclude: ["correctAnswer"] },
  });
  if (
    !data ||
    req.query.numberQuestion === 0 ||
    data.length <= req.query.numberQuestion
  ) {
    throw new ApiError(httpStatus.NOT_FOUND, "Can't get data ");
  }

  const checkQuery = [];
  const dataReturn = [];
  for (let i = 1; i <= req.query.numberQuestion; ++i) {
    while (true) {
      const index = Math.floor(Math.random() * data.count);
      if (!checkQuery[index] || checkQuery[index] === 0) {
        dataReturn.push(data.rows[index]);
        checkQuery[index] = 1;
        break;
      }
    }
  }

  res.send(response(httpStatus.CREATED, "get Exam Success", { dataReturn }));
});

const submitAnswers = catchAsync(async (req, res, next) => {
  // const sum = await req.body.rows.reduce(async (total, value) => {
  //   const quiz = await quizService.getQuizByPK(value.id);
  //   if (quiz.correctAnswer === value.userAnswer) {
  //     total += 100 / req.body.rows;
  //   }
  // }, 0);
  const user = await userService.getUserByPk(req.body.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Can't get user ");
  }
  let sum = 0;
  for (let i = 0; i < req.body.count; i++) {
    value = req.body.rows[i];
    const quiz = await quizService.getQuizByPK(value.id);
    if (quiz.correctAnswer === value.userAnswer) {
      sum += 100 / req.body.count;
    }
  }
  user.lastScore = sum;
  user.highScore = Math.max(user.highScore, sum);
  await user.save();
  res.send(response(httpStatus.CREATED, "submit answer Success", { sum }));
});

module.exports = {
  convertCategoryId,
  createQuiz,
  getQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,

  getExams,
  submitAnswers,
  // getMyProfile,
  // changeContact,
  // changeEmail,
  // changePassword,
  // changeUsername,
  // changeAvatar,
  // getOwnTokens,
};
