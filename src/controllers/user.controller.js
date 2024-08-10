const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

const getAll = catchError(async(req, res) => {
    const results = await User.findAll({include: [{model: Post, through:{attributes: ['userId']}}]});
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash( password, 10 )
    const result = await User.create({ ...req.body, password:hashedPassword })

    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.destroy({ where: {id} });
    if(!result) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
    const { id } = req.params;
    const userProtec = ['password','email']
    userProtec.forEach((e)=>{
        delete req.body[e]
    }); 
    const result = await User.update(req.body, { where: { id }, returning: true });
    return result[0] === 0 ? res.sendStatus(404) : res.json(result[1][0]);
})

const login = catchError(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({where: {email}})

    if(!user) return res.status(401).json({'messsage': 'Las credenciales ingresadas son icorrectas'})

    const isValid = await bcrypt.compare(password, user.password)


    if(!isValid) return res.status(401).json({'messsage': 'Las credenciales ingresadas son icorrectas'})

    const token = jwt.sign(
        {user},
        process.env.TOKEN_SECRET,
        {expiresIn: '1d'}
    )

    return res.status(200).json({user, token})
})

const logged = catchError(async(req, res) => {
    const user = req.user

    return res.json(user)
})

const setPost = catchError(async(req, res) => {
    const { id } = req.params;

    const users = await User.findByPk(id)
    if(!users) return res.json('Usuario no encontrado')

    const postIds = req.body.postIds; // Asegúrate de enviar un array de IDs en el cuerpo

    // Verificar que los posts existen en la base de datos
    const posts = await Post.findAll({
        where: {
            id: postIds
        }
    });

    if (posts.length !== postIds.length) {
        return res.status(404).json({ message: 'Uno o más posts no encontrados' });
    }

    // Establecer la relación en la tabla intermedia 'favorites'
    await users.setPosts(postIds);

    const post = await users.getPosts()

    console.log(postIds)
    return res.json({ message: 'Relación hecha', posts: post })
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login,
    logged,
    setPost
}