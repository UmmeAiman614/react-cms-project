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

categorySchema.pre('validate', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

export default mongoose.model('Category', categorySchema);
