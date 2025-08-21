import { body } from 'express-validator';

export const loginValidation = [
  body('username')
    .trim()
    .matches(/^\S+$/)
    .withMessage('Username cannot contain spaces')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 4, max: 10 })
    .withMessage('Username must be at least 4 to 10 characters long'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 5, max: 10 })
    .withMessage('Password must be at least 5 to 10 characters long')
];

export const userValidation = [
  body('fullname')
    .trim()
    .notEmpty()
    .withMessage('Fullname is required')
    .isLength({ min: 5, max: 25 })
    .withMessage('Fullname must be at least 5 to 25 characters long'),
  body('username')
    .trim()
    .matches(/^\S+$/)
    .withMessage('Username cannot contain spaces')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 5, max: 10 })
    .withMessage('Username must be at least 5 to 10 characters long'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 5, max: 10 })
    .withMessage('Password must be at least 5 to 10 characters long'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['author', 'admin'])
    .withMessage('Role must be author or admin')
];

export const userUpdateValidation = [
  body('fullname')
    .trim()
    .notEmpty()
    .withMessage('Fullname is required')
    .isLength({ min: 5, max: 25 })
    .withMessage('Fullname must be at least 5 to 25 characters long'),
  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 5, max: 10 })
    .withMessage('Password must be at least 5 to 10 characters long'),
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['author', 'admin'])
    .withMessage('Role must be author or admin')
];

export const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3, max: 25 })
    .withMessage('Category name must be at least 3 to 25 characters long'),
  body('description')
    .isLength({ max: 100 })
    .withMessage('Description must be at most 100 characters long')
];

export const articleValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 7, max: 100 })
    .withMessage('Title must be at least 7 to 100 characters long'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 50, max: 1500 })
    .withMessage('Content must be at least 50 to 1500 characters long'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
];
