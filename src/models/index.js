const Favorite = require("./Favorite");
const Post = require("./Post");
const User = require("./User");

Post.belongsTo(User)
User.hasMany(Post)

User.belongsToMany(Post, { through: Favorite, foreignKey: 'user_id', as: 'favoritePosts'  });
Post.belongsToMany(User, { through: Favorite, foreignKey: 'post_id' });

// Favorite.belongsTo(Post)
// Post.hasMany(Favorite)

// Favorite.belongsTo(User)
// User.hasMany(Favorite)

// User.belongsToMany(Post, {through: 'favorites', as: 'FavoritePosts'})
// Post.belongsToMany(User, {through: 'favorites', as: 'FavoritePosts'})