const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');

const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate('author', 'username');
  res.json(posts);
});


const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username');

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});


const createPost = asyncHandler(async (req, res) => {
  const { title, content, excerpt, category, featuredImage, readTime } = req.body;

  const post = new Post({
    title,
    content,
    excerpt,
    category,
    featuredImage: featuredImage || '',
    readTime: readTime || 5,
    author: req.user.id
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
});


const updatePost = asyncHandler(async (req, res) => {
  const { title, content, excerpt, category, featuredImage, readTime } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt || post.excerpt;
    post.category = category || post.category;
    post.featuredImage = featuredImage || post.featuredImage;
    post.readTime = readTime || post.readTime;
    post.updatedAt = Date.now();

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});


const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  await post.deleteOne();
  res.json({ message: 'Post removed' });
});

module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost
};