// backend/middlewares/isAdmin.js
// const createError = require('../utils/error-message.js');
import createError from '../utils/error-message.js';

const isAdmin = (req, res, next) => {
  if (req.role !== 'admin') {
    return next(createError('Access denied: Admins only', 403));
  }
  next();
};

export default isAdmin;
