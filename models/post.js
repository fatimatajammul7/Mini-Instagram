const {DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

const Post = sequelize.define('post', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    caption: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    
 
});

module.exports = Post;