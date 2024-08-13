const catchError = require('../utils/catchError');
const Favorite = require('../models/Favorite');
const Post = require('../models/Post');

const createFavorite = catchError(async(req, res) => {
  const { id } = req.params
  const { id: userId } = req.user
  const { body } = req
  console.log('id del parametro', id)
  console.log('id del usurio', userId)
  if (Number(userId) !== Number(id)) return res.status(404).json({ message: 'user not found' });
  const postIds = await Post.findAll({ where: { id: [body]}})
  if (!postIds) return res.status(404).json({ message: 'post noy found' })
  const obj = {
    userId,
    postId: body
  }
  const result = await Favorite.create(obj);
  return res.status(201).json(result);
});

module.exports = {
  createFavorite 
}