const { validationResult } = require('express-validator');
const Post = require('../models/post');
const Image = require('../models/image');
const Like = require('../models/like');
const Request = require('../models/request');
const Comment = require('../models/comment');
const sequelize = require('../utils/database');

exports.getPosts = async (req, res)=>{
    try
    {
        const userId = req.userId;
        const posts = await Post.findAll({
            where: {
              user_id: userId,
            },
            attributes: ['id', 'caption'], 
            include: [
                {
                    model: Image,
                    as: 'images',
                    attributes: ['id', 'url'],
                }
            ]
          });
        res.status(200).json({ message: "Posts fetched successfully", posts });
    } 
    catch (error) 
    {
        res.status(500).json({ message: "Error fetching posts", error });
    }
    
    

}

exports.createPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ message: "Error in input validation", errors: errors.array() });
    }

    try {
        const userId = req.userId; 
        const caption = req.body.caption;
        const images = req.body.images; 

        const post = await Post.create({ caption: caption, user_id: userId });
        const postId = post.id;

        const imageRecords = images.map((url) => ({
            url: url,
            post_id: postId, 
        }));

        await Image.bulkCreate(imageRecords);

        return res.status(201).json({ message: "Post created successfully", postId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating post", error });
    }
};


