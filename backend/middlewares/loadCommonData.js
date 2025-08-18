// backend/middlewares/loadCommonData.js
import categoryModel from '../models/Category.js';
import newsModel from '../models/News.js';
import settingModel from '../models/settings.js';

const loadCommonData = async (req, res, next) => {
  try {
    const settings = await settingModel.findOne();

    const latestNews = await newsModel
      .find()
      .populate('category', 'name slug')
      .populate('author', 'fullname')
      .sort({ createdAt: -1 })
      .limit(5);

    const categoriesInUse = await newsModel.distinct('category');
    const categories = await categoryModel.find({ _id: { $in: categoriesInUse } });

    // Instead of res.locals (EJS), attach to req for API responses
    req.commonData = {
      settings,
      latestNews,
      categories
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default loadCommonData;
