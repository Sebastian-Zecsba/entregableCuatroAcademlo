const catchError = require('../utils/catchError');
const Favorite = require('../models/Favorite');
const Post = require('../models/Post');

const createFavorite = catchError(async(req, res) => {
  const { id } = req.params
  const { id: userId } = req.user
  const { body } = req

  if (Number(userId) !== Number(id)) return res.status(404).json({ message: 'user not found' });

  const validPosts = await Post.findAll({ where: { id: body}})
  if (!validPosts) return res.status(404).json({ message: 'some posts not found' })
 
  const existingFavorites = await Favorite.findAll({where: { userId, postId: body }})
  const existingPostIds = existingFavorites.map(fav => fav.postId);
  const newPostIds = body.filter(postId => !existingPostIds.includes(postId));
  if (newPostIds.length === 0) return res.status(400).json({ message: 'No new likes to add' });

  const favoriteObjects = newPostIds.map(postId => ({ userId, postId }))

  const result = await Favorite.bulkCreate(favoriteObjects);
  return res.status(201).json(result);
});


module.exports = {
  createFavorite 
}