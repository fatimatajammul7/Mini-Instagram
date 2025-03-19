const Post = require('../models/post');
const Like = require('../models/like');
const Request = require('../models/request');
const sequelize = require('../utils/database');

exports.likePost = async (req, res) => {
    try {
        const userId = req.userId;  
        const postId = req.params.id;

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
                return res.status(403).json({ message: "You can only like posts from users you follow" });
            }
        }

        const like = await Like.create({ user_id: userId, post_id: postId });
        return res.status(201).json({ message: "Post liked successfully", like });
    } 
    catch (error) {
        return res.status(500).json({ message: "Error liking post", error });
    }
};

exports.getMostLiked = async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: [
                'id',
                'caption',
                [sequelize.fn('COUNT', sequelize.col('likes.id')), 'likeCount']
            ],
            include: [
                {
                    model: Like,
                    as: 'likes',
                    attributes: []
                }
            ],
            group: ['post.id'],
            order: [[sequelize.fn('COUNT', sequelize.col('likes.id')), 'DESC']],
            subQuery: false
        });

        if (posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        const maxLikeCount = posts[0].getDataValue('likeCount');

        const mostLikedPosts = posts.filter(post => post.getDataValue('likeCount') === maxLikeCount);

        res.status(200).json({ message: "Most liked posts retrieved successfully", posts: mostLikedPosts});
    } catch (error) 
    {
        res.status(500).json({ message: "Error retrieving the most liked posts", error});
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "Invalid post" });
        }

        const like = await Like.findOne({
            where: {
                user_id: userId,
                post_id: postId
            }
        });

        if (!like) {
            return res.status(404).json({ message: "Cant't unlike, you haven't liked this!" });
        }

        await like.destroy();

        return res.status(200).json({ message: "Post unliked successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error unliking post", error });
    }
};
