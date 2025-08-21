// controllers/sideController.js
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import News from '../models/News.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import paginate from '../utils/paginate.js';
import createError from '../utils/error-message.js';

// -------------------- Home Page --------------------
export const index = async (req, res, next) => {
  try {
    const paginatedNews = await paginate(
      News,
      {},
      req.query,
      {
        populate: [
          { path: 'category', select: 'name slug' },
          { path: 'author', select: 'fullname' }
        ],
        sort: { createdAt: -1 }
      }
    );

    res.json({ success: true, data: paginatedNews });
  } catch (error) {
    next(error);
  }
};

// -------------------- Articles by Category --------------------
export const articleByCategories = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.name });
    if (!category) return next(createError('Category not found', 404));

    const paginatedNews = await paginate(
      News,
      { category: category._id },
      req.query,
      {
        populate: [
          { path: 'category', select: 'name slug' },
          { path: 'author', select: 'fullname' }
        ],
        sort: { createdAt: -1 }
      }
    );

    res.json({ success: true, category, data: paginatedNews });
  } catch (error) {
    next(error);
  }
};

// -------------------- Single Article --------------------
export const singleArticle = async (req, res, next) => {
  try {
    const article = await News.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('author', 'fullname');

    if (!article) return next(createError('Article not found', 404));

    const comments = await Comment.find({ article: req.params.id, status: 'approved' })
      .sort({ createdAt: -1 });

    res.json({ success: true, article, comments });
  } catch (error) {
    next(error);
  }
};

// -------------------- Search Articles --------------------
export const search = async (req, res, next) => {
  try {
    const searchQuery = req.query.search || '';

    const paginatedNews = await paginate(
      News,
      {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { content: { $regex: searchQuery, $options: 'i' } }
        ]
      },
      req.query,
      {
        populate: [
          { path: 'category', select: 'name slug' },
          { path: 'author', select: 'fullname' }
        ],
        sort: { createdAt: -1 }
      }
    );

    res.json({ success: true, searchQuery, data: paginatedNews });
  } catch (error) {
    next(error);
  }
};

// -------------------- Articles by Author --------------------
export const author = async (req, res, next) => {
  try {
    const authorData = await User.findById(req.params.name);
    if (!authorData) return next(createError('Author not found', 404));

    const paginatedNews = await paginate(
      News,
      { author: req.params.name },
      req.query,
      {
        populate: [
          { path: 'category', select: 'name slug' },
          { path: 'author', select: 'fullname' }
        ],
        sort: { createdAt: -1 }
      }
    );

    res.json({ success: true, author: authorData, data: paginatedNews });
  } catch (error) {
    next(error);
  }
};

// -------------------- Add Comment --------------------
export const addComment = async (req, res, next) => {
  try {
    const { name, email, content } = req.body;
    const articleId = req.params.id;

    console.log("POST /single/:id/comment hit");
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);
    console.log("Creating new comment for article:", articleId);

    const newComment = new Comment({
      name,
      email,
      content,
      article: articleId,
      status: 'pending', // ✅ explicitly set default
    });

    await newComment.save();

    console.log("Comment saved:", newComment);

    res.status(201).json({ success: true, message: 'Comment added', comment: newComment });
  } catch (error) {
    console.error("Failed to add comment:", error);
    next(createError('Failed to add comment', 500));
  }
};


