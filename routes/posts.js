const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth')
const postsController = require('../controllers/posts');

router.get('/posts', isAuth, postsController.getPosts);

router.post('/post', isAuth,
  [
    body('images')
      .isArray({ min: 1 }),
    body('images.*') 
      .isString()
  ],
  postsController.createPost
);


module.exports = router;