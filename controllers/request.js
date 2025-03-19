const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const Request = require('../models/request');
const User = require('../models/user');

exports.getUsers = async (req, res) => {
    try {
        const userId = req.userId; 
    
        const users = await User.findAll({
            where: {
            id: { [Op.ne]: userId }, 
            },
            attributes: ['id', 'username'], 
        });
    
        res.status(200).json({ message: "Users fetched successfully", users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

exports.sendRequest = async (req, res) => {
    try {
        const followerId = req.userId; 
        const followedId = req.params.id;
        if(followerId == followedId){
            return res.status(400).json({ message: "Cannot send request to yourself" });
        }

        const user = await User.findByPk(followedId);
        if(!user)
        {
            return res.status(404).json({ message: "The User you want to follow not found" });
        }

        const existingRequest = await Request.findOne({
            where: {
                follower_id: followerId,
                followed_id: followedId
            }
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Follow request already exists" });
        }

        await Request.create({ follower_id: followerId, followed_id: followedId });
  
        return res.status(200).json({ message: "Request sent sucessfuly"});
    } 
    catch (error) 
    {
        return res.status(500).json({ message: "Error sending request", error });
    }
};

exports.updateRequestStatus = async (req, res) => {

    const followedId = req.userId; 
    const followerId = req.params.id; 
    const newStatus = req.body.status;  

    try {
        const request = await Request.findOne({
            where: {
                follower_id: followerId,
                followed_id: followedId
            }
        });

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        request.status = newStatus;
        await request.save();

        res.status(200).json({ message: `Request ${newStatus} successfully!` });
    } catch (error) {
        res.status(500).json({ message: "Error updating request status", error });
    }
};

exports.getFollowers = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({
            where: {
                username: username
            }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const followers = await User.findAll({
            attributes: ['id', 'username'],
            include: [{
                model: Request,
                as: 'followRequestsSent',
                attributes: [],
                where: {
                    followed_id: user.id,
                    status: 'accepted'
                },
                required: true // see why
            }]
        });

        res.status(200).json({ message: `Followers of ${username} are: `, followers });
    } catch (error) {
        res.status(500).json({ message: "Error fetching followers", error });
    }
};
