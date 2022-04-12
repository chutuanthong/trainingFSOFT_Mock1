const express = require("express");
const authRoute = require("./authRouter");
const userRoute = require("./userRouter");
const quizRouter = require("./quizRouter");
const categoryRouter = require("./categoryRouter");
// const docsRoute = require("./docs.route");
// const config = require("../../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/categories",
    route: categoryRouter,
  },
  {
    path: "/quizzes",
    route: quizRouter,
  },
];

// const devRoutes = [
//   // routes available only in development mode
//   {
//     path: "/docs",
//     route: docsRoute,
//   },
// ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
// if (config.env === 'development') {
//   devRoutes.forEach((route) => {
//     resolvers.use(route.path, route.route);
//   });
// }

module.exports = router;
