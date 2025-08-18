// backend/controllers/categoryController.js
import categoryModel from '../models/Category.js';
import newsModel from '../models/News.js';
import createError from '../utils/error-message.js';
import { validationResult } from 'express-validator';

// Get all categories
export const allCategory = async (req, res, next) => {
  try {
    const categories = await categoryModel.find();
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

// Get data for add category form
export const addCategoryPage = async (req, res) => {
  // In API, we just send a success response or default values
  res.json({ message: 'Provide name and description to add category' });
};

// Add new category
export const addCategory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const category = await categoryModel.create(req.body);
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    next(error);
  }
};

// Get category for update
export const updateCategoryPage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await categoryModel.findById(id);
    if (!category) return next(createError('Category not found', 404));

    res.json({ category });
  } catch (error) {
    next(error);
  }
};

// Update category
export const updateCategory = async (req, res, next) => {
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const category = await categoryModel.findById(id);
    return res.status(400).json({ errors: errors.array(), category });
  }
  try {
    const category = await categoryModel.findById(id);
    if (!category) return next(createError('Category not found', 404));

    category.name = req.body.name;
    category.description = req.body.description;
    await category.save();

    res.json({ message: 'Category updated', category });
  } catch (error) {
    next(error);
  }
};

// Delete category
export const deleteCategory = async (req, res, next) => {
  const id = req.params.id;
  try {
    const category = await categoryModel.findById(id);
    if (!category) return next(createError('Category not found', 404));

    const article = await newsModel.findOne({ category: id });
    if (article) {
      return res.status(400).json({ success: false, message: 'Category is associated with articles' });
    }

    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};
