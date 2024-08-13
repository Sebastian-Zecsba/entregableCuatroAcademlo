const { getAll, create, getOne, remove, update, login, logged, setPost } = require('../controllers/user.controller');
const express = require('express');
const { verifyJwt } = require('../utils/verify');

const routerUser = express.Router();

routerUser.route('/')
    .get(verifyJwt ,getAll)
    .post(create);

routerUser.route('/login')
    .post(login)

routerUser.route('/me')
    .get(verifyJwt, logged)

routerUser.route('/:id/posts')
    .post(verifyJwt, setPost)

routerUser.route('/:id')
    .get(verifyJwt, getOne)
    .delete(verifyJwt, remove)
    .put(verifyJwt, update);

module.exports = routerUser;