const catchError = require('../utils/catchError');
const Post = require('../models/Post');
const User = require('../models/User');

const getAll = catchError(async(req, res) => {
    const results = await Post.findAll();
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { id } = req.user;
    const newBody = {...req.body, userId: id}
    const result = await Post.create(newBody);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Post.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Post.destroy({ where: {id} });
    if(!result) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const postProtection = ['userId']
    postProtection.forEach((e)=>{
        delete req.body[e]
    }); 
    const result = await Post.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}