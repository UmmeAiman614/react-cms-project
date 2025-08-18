// backend/models/category.js
import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Generate slug before validation
categorySchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
