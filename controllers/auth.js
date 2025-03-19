const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ message: "Error in the input validation", errors: errors.array() });
    }
    try {
        const username = req.body.username;
        const password = req.body.password;

        const user = await User.findOne({where: { username: username }});
        if (!user) {
        return res.status(404).json({ message: "User not found" });
        }

        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
            return res.status(401).json({ message: "Wrong password" });
        }

        const token = jwt.sign(
        {
            username: user.username,
            userId: user.id.toString()
        },
        'somesupersecretsecret',
        { expiresIn: '1h' }
        );
        return res.status(200).json({ message: "User Successfully logged in!", token: token, userId: user.id.toString()});
    
        
    } catch (error) {
        return res.status(500).json({ message: "Error creating user", error });
    }
    
}


exports.signUp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ message: "Error in input validation", errors: errors.array() });
    }

    try {
        const username = req.body.username;
        const password = req.body.password;
        
        const newPassword = await bcrypt.hash(password, 12);
        const user = await User.create({ username: username, password: newPassword });
        return res.status(201).json({ message: "User created", user });
    } catch (error) {
        return res.status(500).json({ message: "Error creating user", error });
    }
};
