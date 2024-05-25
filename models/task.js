// src/models/task.js
const { DataTypes } = require('sequelize');
const sequelize = require('../src/config/sequelize');
const Profile = require('./profile'); // Assuming you have the Profile model defined

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  profileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Profile,
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'tasks',
  timestamps: false,
});


Profile.hasMany(Task, { foreignKey: 'profileId' });
Task.belongsTo(Profile, { foreignKey: 'profileId' });


module.exports = Task;
