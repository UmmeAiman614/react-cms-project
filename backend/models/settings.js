// backend/models/setting.js
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

const Setting = mongoose.model('Setting', settingsSchema);
export default Setting;
