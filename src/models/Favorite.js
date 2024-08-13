const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Favorite = sequelize.define('favorite', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id'
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'post_id'
    },
});

module.exports = Favorite;