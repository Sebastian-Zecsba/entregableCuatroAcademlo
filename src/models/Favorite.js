const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');
const Favorite = sequelize.define('favorite', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
});
module.exports = Favorite;