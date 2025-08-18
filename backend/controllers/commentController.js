// backend/controllers/commentController.js
import commentModel from '../models/Comment.js';
import newsModel from '../models/News.js';
import createError from '../utils/error-message.js';

// Get all comments
export const allComments = async (req, res, next) => {
  try {
    let comments;
    if (req.role === 'admin') {
      comments = await commentModel.find()
        .populate('article', 'title')
        .sort({ createdAt: -1 });
    } else {
      const news = await newsModel.find({ author: req.id });
      const newsIds = news.map(n => n._id);
      comments = await commentModel.find({ article: { $in: newsIds } })
        .populate('article', 'title')
        .sort({ createdAt: -1 });
    }

    if (!comments || comments.length === 0) {
      return next(createError(404, 'No comments found'));
    }

    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

// Update comment status (pending / approved / rejected)
export const updateCommentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const comment = await commentModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!comment) return next(createError(404, 'Comment not found'));
    res.json({ success: true, message: 'Comment status updated', comment });
  } catch (error) {
    next(error);
  }
};

// Delete comment
export const deleteComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await commentModel.findByIdAndDelete(id);
    if (!comment) return next(createError(404, 'Comment not found'));
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};
