// src/models/profile.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'profiles',
  timestamps: false,
});


module.exports = Profile;
