const Post = require("./Post");
const User = require("./User");

Post.belongsTo(User)
User.hasMany(Post)

User.belongsToMany(Post, {through: 'favorites', as: 'FavoritePosts'})
Post.belongsToMany(User, {through: 'favorites', as: 'FavoritePosts'})