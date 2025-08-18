// backend/middlewares/isLoggedIn.js
import jwt from 'jsonwebtoken';
import createError from '../utils/error-message.js';

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return next(createError('Not authenticated', 401));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, tokenData) => {
      if (err) {
        return next(createError('Invalid token', 401));
      }

      req.id = tokenData.id;
      req.role = tokenData.role;
      req.fullname = tokenData.fullname;
      next();
    });
  } catch (error) {
    next(createError(error.message, 500));
  }
};

export default isLoggedIn;
