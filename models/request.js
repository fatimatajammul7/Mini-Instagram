const { DataTypes} = require('sequelize');
const sequelize = require('../utils/database');

const Request = sequelize.define('request', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending',
    },
    
});

module.exports = Request;