import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  website_title: {
    type: String,
    required: true
  },
  website_logo: {
    type: String
  },
  footer_description: {
    type: String,
    required: true
  }
});

export default mongoose.model('Setting', settingsSchema);
