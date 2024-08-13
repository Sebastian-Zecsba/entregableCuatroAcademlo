const express = require('express');
const routerUser = require('./user.router');
const routerPost = require('./post.router');
const { verifyJwt } = require('../utils/verify');
const router = express.Router();

// colocar las rutas aquí
router.use('/users', routerUser)
router.use('/posts', verifyJwt, routerPost)

module.exports = router;