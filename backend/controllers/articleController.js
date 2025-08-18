// backend/controllers/articleController.js
import newsModel from '../models/News.js';
import categoryModel from '../models/Category.js';
import fs from 'fs';
import path from 'path';
import createError from '../utils/error-message.js';
import { validationResult } from 'express-validator';

// Get all articles
export const allArticle = async (req, res, next) => {
  try {
    let articles;
    if (req.role === 'admin') {
      articles = await newsModel.find()
        .populate('category', 'name')
        .populate('author', 'fullname');
    } else {
      articles = await newsModel.find({ author: req.id })
        .populate('category', 'name')
        .populate('author', 'fullname');
    }
    res.json({ articles });
  } catch (error) {
    next(error);
  }
};

// Get categories for creating article
export const addArticlePage = async (req, res, next) => {
  try {
    const categories = await categoryModel.find();
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

// Add new article
export const addArticle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const categories = await categoryModel.find();
    return res.status(400).json({ errors: errors.array(), categories });
  }

  const { title, content, category } = req.body;
  const image = req.file;

  if (!image) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

  const news = new newsModel({
    title,
    content,
    category,
    image: image.filename,
    author: req.id
  });

  try {
    await news.save();
    res.status(201).json({ message: 'Article created', news });
  } catch (error) {
    next(error);
  }
};

// Get article for update
export const updateArticlePage = async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await newsModel.findById(id)
      .populate('category', 'name')
      .populate('author', 'fullname');

    if (!article) return next(createError('Article not found', 404));

    if (req.role === 'author' && req.id !== String(article.author._id)) {
      return next(createError('Not authorized to update this article', 401));
    }

    const categories = await categoryModel.find();
    res.json({ article, categories });
  } catch (error) {
    next(error);
  }
};

// Update article
export const updateArticle = async (req, res, next) => {
  const id = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const categories = await categoryModel.find();
    return res.status(400).json({ errors: errors.array(), categories, article: req.body });
  }

  const { title, content, category } = req.body;
  const image = req.file;

  try {
    const article = await newsModel.findById(id);
    if (!article) return next(createError('Article not found', 404));

    if (req.role === 'author' && req.id !== String(article.author._id)) {
      return next(createError('Not authorized to update this article', 401));
    }

    article.title = title;
    article.content = content;
    article.category = category;

    // Replace image if new uploaded
    if (image) {
      if (article.image) {
        const imagePath = path.join(__dirname, '../public/uploads', article.image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }
      article.image = image.filename;
    }

    await article.save();
    res.json({ message: 'Article updated', article });
  } catch (error) {
    next(error);
  }
};

// Delete article
export const deleteArticle = async (req, res, next) => {
  try {
    const id = req.params.id;
    const article = await newsModel.findById(id);
    if (!article) return next(createError('Article not found', 404));

    if (req.role === 'author' && req.id !== String(article.author._id)) {
      return next(createError('Not authorized to delete this article', 401));
    }

    // Delete image
    if (article.image) {
      const imagePath = path.join(__dirname, '../public/uploads', article.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await article.deleteOne();
    res.json({ message: 'Article deleted', success: true });
  } catch (error) {
    next(error);
  }
};
