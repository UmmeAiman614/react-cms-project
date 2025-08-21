import jwt from 'jsonwebtoken';

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      fullname: decoded.fullname,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please login again' });
    }
    res.status(401).json({ message: 'Invalid token, authentication failed' });
  }
};

export default isLoggedIn;
