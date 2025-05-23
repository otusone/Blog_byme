const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');


const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;


  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});


const register = asyncHandler(async (req, res) => {
  const { username, password, role } = req.body;

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    password,
    role: role || 'user'
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = {
  login,
  register
};