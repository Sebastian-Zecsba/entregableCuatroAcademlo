const Favorite = require("./Favorite");
const Post = require("./Post");
const User = require("./User");

Post.belongsTo(User)
User.hasMany(Post)

Favorite.belongsTo(Post)
Post.hasMany(Favorite)
Favorite.belongsTo(User)
User.hasMany(Favorite)

// User.belongsToMany(Post, {through: 'favorites', as: 'FavoritePosts'})
// Post.belongsToMany(User, {through: 'favorites', as: 'FavoritePosts'})