const {DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

const Comment = sequelize.define('comment', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    content:{
        type: DataTypes.TEXT,
        allowNull: false,
    }
    
});

module.exports = Comment;