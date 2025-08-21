// backend/controllers/categoryController.js
import Category from '../models/Category.js';
import News from '../models/News.js';
import { validationResult } from 'express-validator';
import createError from '../utils/error-message.js';

// GET all categories
export const allCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET add category page (for frontend to fetch initial data if needed)
export const addCategoryPage = async (req, res) => {
  res.json({ message: 'Add category page', errors: [] });
};

// POST add category
export const addCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const category = await Category.create(req.body);
    res.status(201).json({ message: 'Category created successfully', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET update category page
export const updateCategoryPage = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(createError('Category not found', 404));

    res.json({ category, errors: [] });
  } catch (error) {
    next(error);
  }
};

// PUT update category
export const updateCategory = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(createError('Category not found', 404));

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), category });

    category.name = req.body.name;
    category.description = req.body.description;

    await category.save();
    res.json({ message: 'Category updated successfully', category });
  } catch (error) {
    next(error);
  }
};

// DELETE category
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return next(createError('Category not found', 404));

    const article = await News.findOne({ category: req.params.id });
    if (article) return res.status(400).json({ success: false, message: 'Category is associated with articles' });

    await category.deleteOne();
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};
