const Post = require("./Post");
const User = require("./User");

Post.belongsTo(User)
User.hasMany(Post)

User.belongsToMany(Post, {through: 'favorites'})
Post.belongsToMany(User, {through: 'favorites'})