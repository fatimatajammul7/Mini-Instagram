const {DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

const Like = sequelize.define('like', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
}, {
    timestamps: true,
    updatedAt: false
});

module.exports = Like;