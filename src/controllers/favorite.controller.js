const catchError = require('../utils/catchError');
const Favorite = require('../models/Favorite');
const Post = require('../models/Post');

const createFavorite = catchError(async(req, res) => {
  const { id } = req.params
  const userId = req.user.id
  const { body } = req

  if (Number(userId) !== Number(id)) return res.status(404).json({ message: 'user not found' });

  const posts = await Post.findAll({ where: { id: body } });

  if (posts.length === 0) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const favorites = posts.map(post => {
    return {
      user_id: userId,
      post_id: post.id
    };
  });

  const result = await Favorite.bulkCreate(favorites);
  return res.status(201).json(result);
});

module.exports = {
  createFavorite 
}