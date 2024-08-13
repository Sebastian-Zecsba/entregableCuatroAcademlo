const { getAll, create, getOne, remove, update } = require('../controllers/post.controller');
const express = require('express');

const routerPost = express.Router();

routerPost.route('/')
    .get(getAll)
    .post(create);

routerPost.route('/:id')
    .get(getOne)
    .delete(remove)
    .put(update);

module.exports = routerPost;