const { validationResult } = require('express-validator');
const Post = require('../models/post');
const Request = require('../models/request');
const Comment = require('../models/comment');
const sequelize = require('../utils/database');

exports.commentPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ message: "Error in input validation", errors: errors.array() });
    }
    try {
        const userId = req.userId;  
        const postId = req.params.id;
        const content = req.body.content;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "Invalid post" });
        }
       
        const authorId = post.user_id; 
        if(userId != authorId){
            const followed = await Request.findOne({
                where: {
                    follower_id: userId,
                    followed_id: authorId,
                    status: 'accepted' 
                }
            });
    
            if (!followed) {
                return res.status(403).json({ message: "You can only comment on posts from users you follow" });
            }
        }

        const comment = await Comment.create({ user_id: userId, post_id: postId, content: content});
        return res.status(201).json({ message: "Post commented successfully", comment });
    } 
    catch (error) {
        return res.status(500).json({ message: "Error commenting on the post", error });
    }
};

exports.replyComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ message: "Error in input validation", errors: errors.array() });
    }
    try {
        const userId = req.userId;  
        const commentId = req.params.id;
        const content = req.body.content;

        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Invalid comment" });
        }
        const postId = comment.post_id;
        const post = await Post.findByPk(postId);

        const authorId = post.user_id; 
        if(userId != authorId){
            const followed = await Request.findOne({
                where: {
                    follower_id: userId,
                    followed_id: authorId,
                    status: 'accepted' 
                }
            });
    
            if (!followed) {
                return res.status(403).json({ message: "You can only comment on posts from users you follow" });
            }
        }

        const reply = await Comment.create({ user_id: userId, post_id: postId, content: content, parent_comment_id: commentId });
        return res.status(201).json({ message: "Post commented successfully", reply });
    } 
    catch (error) {
        return res.status(500).json({ message: "Error commenting on the post", error });
    }
};



exports.getLeastCommented = async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: [
                'id',
                'caption',
                [sequelize.fn('COUNT', sequelize.col('comments.id')), 'commentCount']
            ],
            include: [
                {
                    model: Comment,
                    as: 'comments',
                    attributes: []
                }
            ],
            group: ['post.id'],
            order: [[sequelize.fn('COUNT', sequelize.col('comments.id')), 'ASC']],
            subQuery: false
        });

        if (posts.length == 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        const minCommentCount = posts[0].getDataValue('commentCount');

        const leastCommentedPosts = posts.filter(post => post.getDataValue('commentCount') === minCommentCount);

        res.status(200).json({ message: "Least commented posts retrieved successfully", posts: leastCommentedPosts});
    } 
    catch (error) {
        res.status(500).json({ message: "Error retrieving the least commented posts", error: error.message });
    }
};

exports.updateComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ message: "Error in input validation", errors: errors.array() });
    }
    try {
        const userId = req.userId;  
        const commentId = req.params.id;
        const content = req.body.content;

        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Invalid comment" });
        }

        if (comment.user_id != userId) {
            return res.status(403).json({ message: "You can only update your own comments" });
        }

        comment.content = content;
        await comment.save();

        return res.status(200).json({ message: "Comment updated successfully", comment });
    } 
    catch (error) {
        return res.status(500).json({ message: "Error updating the comment", error });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const userId = req.userId;  
        const commentId = req.params.id;

        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Invalid comment" });
        }

        const post = await Post.findByPk(comment.post_id);

        if (comment.user_id != userId && post.user_id != userId) {
            return res.status(403).json({ message: "You are not allowed to delete this comment" });
        }

        await Comment.destroy({
            where: {
                parent_comment_id: commentId
            }
        });
        await comment.destroy();

        return res.status(200).json({ message: "Comment deleted successfully" });
    } 
    catch (error) {
        return res.status(500).json({ message: "Error deleting the comment", error });
    }
};




