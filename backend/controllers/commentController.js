// backend/controllers/commentController.js
import Comment from '../models/Comment.js';
import News from '../models/News.js';
import createError from '../utils/error-message.js';

// GET all comments
export const allComments = async (req, res, next) => {
  try {
    console.log("Incoming request: GET /admin/comment");
    console.log("req.user:", req.user);

    if (!req.user) {
      return next(createError("User not authenticated", 401));
    }

    let comments;

    if (req.user.role === 'admin') {
      // Admin sees all comments
      comments = await Comment.find()
        .populate('article', 'title')
        .sort({ createdAt: -1 });
    } else {
      // Regular user sees comments on their articles only
      const news = await News.find({ author: req.user.id }); // <-- use req.user.id
      const newsIds = news.map(n => n._id);
      comments = await Comment.find({ article: { $in: newsIds } })
        .populate('article', 'title')
        .sort({ createdAt: -1 });
    }

    if (!comments || comments.length === 0) {
      console.log("No comments found");
      return next(createError('No comments found', 404));
    }

    console.log("Fetched comments:", comments.length);
    res.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    next(error);
  }
};


// PUT update comment status
export const updateCommentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!comment) return next(createError('Comment not found', 404));

    res.json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};

// DELETE comment
export const deleteComments = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return next(createError('Comment not found', 404));

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
