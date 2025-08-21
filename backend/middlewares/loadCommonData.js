import Category from '../models/Category.js';
import News from '../models/News.js';
import Setting from '../models/settings.js';

const loadCommonData = async (req, res, next) => {
  try {
    const settings = await Setting.findOne();

    const latestNews = await News.find()
      .populate('category', { name: 1, slug: 1 })
      .populate('author', 'fullname')
      .sort({ createdAt: -1 })
      .limit(5);

    const categoriesInUse = await News.distinct('category');
    const categories = await Category.find({ _id: { $in: categoriesInUse } });

    // Attach data to request object instead of res.locals
    req.commonData = {
      settings,
      latestNews,
      categories
    };

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default loadCommonData;
