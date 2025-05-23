const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  readTime: {
    type: Number,
    default: 5
  },
  slug: {
    type: String,
    unique: true
  },
  // createdAt: {
  //   type: Date,
  //   default: Date.now
  // },
  // updatedAt: {
  //   type: Date,
  //   default: Date.now
}, { timestamps: true });

// Generate slug before saving
PostSchema.pre('save', function (next) {
  this.slug = this.title.toLowerCase().split(' ').join('-');
  next();
});

module.exports = mongoose.model('Post', PostSchema);