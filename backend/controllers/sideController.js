// backend/controllers/sideController.js
import categoryModel from '../models/Category.js';
import newsModel from '../models/News.js';
import userModel from '../models/User.js';
import commentModel from '../models/Comment.js';
import createError from '../utils/error-message.js';
import paginate from '../utils/paginate.js';

// Home page - paginated news
export const index = async (req, res, next) => {
  try {
    const paginatedNews = await paginate(newsModel, {},
      req.query, {
        populate: [
          { path: 'category', select: 'name slug' },
          { path: 'author', select: 'fullname' }
        ],
        sort: { createdAt: -1 }
      }
    );

    res.json({ paginatedNews, query: req.query });
  } catch (error) {
    next(error);
  }
};

// Get articles by category
export const articleByCategories = async (req, res, next) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.name });
    if (!category) return next(createError('Category not found', 404));

    const paginatedNews = await paginate(newsModel, { category: category._id },
      req.query, {
        populate: [
          { path: 'category', select: 'name slug' },
          { path: 'author', select: 'fullname' }
        ],
        sort: { createdAt: -1 }
      }
    );

    res.json({ paginatedNews, category, query: req.query });
  } catch (error) {
    next(error);
  }
};

// Get single article with approved comments
export const singleArticle = async (req, res, next) => {
  try {
    const singleNews = await newsModel.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('author', 'fullname');

    if (!singleNews) return next(createError('Article not found', 404));

    const comments = await commentModel.find({ article: req.params.id, status: 'approved' })
      .sort({ createdAt: -1 });

    res.json({ singleNews, comments });
  } catch (error) {
    next(error);
  }
};

// Search articles
export const search = async (req, res, next) => {
  try {
    const searchQuery = req.query.search || '';
    const paginatedNews = await paginate(newsModel, {
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { content: { $regex: searchQuery, $options: 'i' } }
      ]
    },
      req.query, {
        populate: [
          { path: 'category', select: 'name slug' },
          { path: 'author', select: 'fullname' }
        ],
        sort: { createdAt: -1 }
      }
    );

    res.json({ paginatedNews, searchQuery, query: req.query });
  } catch (error) {
    next(error);
  }
};

// Get articles by author
export const author = async (req, res, next) => {
  try {
    const author = await userModel.findById(req.params.name);
    if (!author) return next(createError('Author not found', 404));

    const paginatedNews = await paginate(newsModel, { author: req.params.name },
      req.query, {
        populate: [
          { path: 'category', select: 'name slug' },
          { path: 'author', select: 'fullname' }
        ],
        sort: { createdAt: -1 }
      }
    );

    res.json({ paginatedNews, author, query: req.query });
  } catch (error) {
    next(error);
  }
};

// Add comment to an article
export const addComment = async (req, res, next) => {
  try {
    const { name, email, content } = req.body;

    const newComment = new commentModel({
      name,
      email,
      content,
      article: req.params.id
    });

    await newComment.save();
    res.status(201).json({ message: 'Comment added', comment: newComment });
  } catch (error) {
    next(createError('Failed to add comment', 500));
  }
};
