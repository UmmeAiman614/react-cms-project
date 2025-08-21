import Article from '../models/News.js';
import Category from '../models/Category.js';
import fs from 'fs';
import path from 'path';
import { validationResult } from 'express-validator';

// GET all articles
export const allArticle = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { author: req.user.id };
    const articles = await Article.find(filter)
      .populate('category', 'name')
      .populate('author', 'fullname');
    res.json(articles);
  } catch (error) {
    console.error("Error fetching all articles:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET categories for add article page
export const addArticlePage = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: error.message });
  }
};

// POST add article
export const addArticle = async (req, res) => {
  console.log("USER INFO:", req.user);
  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, content, category } = req.body;
  const image = req.file;
  if (!image) return res.status(400).json({ message: "Please upload an image" });

  try {
    const article = new Article({
      title,
      content,
      category,
      image: image.filename,
      author: req.user.id,
    });
    await article.save();
    res.status(201).json({ message: "Article created successfully", article });
  } catch (error) {
    console.error("Error saving article:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET single article with categories for update page
export const updateArticlePage = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('category', 'name')
      .populate('author', 'fullname');

    if (!article) return res.status(404).json({ message: 'Article not found' });

    // Only author or admin can update
    if (req.user.role === 'author' && req.user.id !== article.author._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this article' });
    }

    const categories = await Category.find();
    res.json({ article, categories });
  } catch (error) {
    console.error("Error fetching article for update:", error);
    res.status(500).json({ message: error.message });
  }
};

// PUT update article
export const updateArticle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, content, category } = req.body;
  const image = req.file;

  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    if (req.user.role === 'author' && req.user.id !== article.author._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to update this article' });
    }

    article.title = title;
    article.content = content;
    article.category = category;

    if (image) {
      if (article.image) {
        const imagePath = path.join('public/uploads', article.image);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }
      article.image = image.filename;
    }

    await article.save();
    res.json({ message: 'Article updated successfully', article });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE article
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });

    if (req.user.role === 'author' && req.user.id !== article.author._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this article' });
    }

    if (article.image) {
      const imagePath = path.join('public/uploads', article.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await article.deleteOne();
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single article by ID
// get article by id (for editing)
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).populate("category");
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const categories = await Category.find(); // so frontend can show category dropdown

    res.json({ article, categories });
  } catch (err) {
    console.error("Error fetching article:", err);
    res.status(500).json({ message: "Server error while fetching article" });
  }
};

