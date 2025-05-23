const express = require('express');
const router = express.Router();

const { protect, admin } = require('../middleware/authMiddleware');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postControllers');


router.get('/get', getPosts);
router.post('/create', protect, admin, createPost);
router.put('/update/:id', protect, admin, updatePost);
router.delete('/delete/:id', protect, admin, deletePost);
router.get('/get/:id', getPost);

module.exports = router;
