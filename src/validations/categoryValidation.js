const Joi = require("joi");

const createCategory = {
  body: Joi.object().keys({
    categoryName: Joi.string().trim().lowercase().required(),
  }),
};

const getCategories = {
  query: Joi.object().keys({
    categoryName: Joi.string().trim().lowercase(),
    sortBy: Joi.string().trim().lowercase(),
    order: Joi.string().trim().lowercase(),
    size: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCategory = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
  body: Joi.object()
    .keys({
      categoryName: Joi.string().trim().lowercase().required(),
    })
    .min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
