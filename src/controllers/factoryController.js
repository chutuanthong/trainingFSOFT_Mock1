const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
// const APIFeatures = require("../utils/apiFeatures");
const response = require("../utils/responseTemp");
const pick = require("../utils/pick");
const paginationService = require("../services/paginationService");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findByPk(req.params.id);
    if (!model) {
      throw new ApiError(httpStatus.NOT_FOUND, "Can't find by id to delete");
    }
    await model.destroy();
    res.send(response(httpStatus.OK, "Delete success"));
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByPk(req.params.id);
    if (!document) {
      throw new ApiError(httpStatus.NOT_FOUND, "Can't find by id to update");
    }
    if (
      req.body.email &&
      document.email &&
      (await Model.isEmailTaken(req.body.email))
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Email address already in use!"
      );
    }

    Object.assign(document, req.body);
    await document.save();

    res.send(response(httpStatus.OK, "Update success", document));
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(`req after THOR`, req);
    const document = await Model.create(req.body);
    res.send(response(httpStatus.CREATED, "Create Success", { document }));
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const model = await Model.findByPk(req.params.id);
    if (!model) {
      throw new ApiError(httpStatus.NOT_FOUND, "Can't find by id");
    }
    res.send(response(httpStatus.OK, "Get One Success", model));
  });

exports.getAll = (Model, filterKeys, excludeKeys) =>
  catchAsync(async (req, res, next) => {
    const filter = pick(req.query, filterKeys);
    const options = pick(req.query, ["sortBy", "order", "size", "page"]);

    const page = parseInt(options.page, 10);
    const size = parseInt(options.size, 10);
    const { limit, offset } = paginationService.getPagination(page, size);
    if (!options.sortBy) options.sortBy = "createdAt";
    if (!options.order) options.order = "desc";
    const data = await Model.findAndCountAll({
      where: filter,
      limit,
      offset,
      order: [[options.sortBy, options.order]],
      attributes: { exclude: excludeKeys },
    });
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, "Model not found");
    }
    const documents = paginationService.getPagingData(data, page, limit);
    res.send(response(httpStatus.CREATED, "Select all Success", { documents }));
  });
