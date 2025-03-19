const express = require('express');
const router = express.Router();

const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth')
const commentController = require('../controllers/comment');

router.post('/comment/:id', isAuth,
    [
      body('content').notEmpty()
    ],
    commentController.commentPost
  );
  
  
router.post('/reply-comment/:id', isAuth,
    [
      body('content').notEmpty()
    ],
    commentController.replyComment
  );

router.patch('/update-comment/:id', isAuth, 
    [
      body('content').notEmpty()
    ], 
    commentController.updateComment
);  
  
router.get("/least-commented", commentController.getLeastCommented)

router.delete('/delete-comment/:id', isAuth, commentController.deleteComment);

module.exports = router;