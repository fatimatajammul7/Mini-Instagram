const express = require('express');
const router = express.Router();

const isAuth = require('../middleware/is-auth')
const likeController = require('../controllers/like');

router.post('/like/:id', isAuth, likeController.likePost);

router.get("/most-liked", likeController.getMostLiked)

router.delete('/unlike/:id', isAuth, likeController.unlikePost);

module.exports = router;