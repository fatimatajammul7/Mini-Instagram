const {DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

const Image = sequelize.define('image', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
    updatedAt: false
});

module.exports = Image;