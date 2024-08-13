const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');

const getAll = catchError(async(req, res) => {
    const results = await User.findAll({
        include: [{
            model: Post,
            as: 'FavoritePosts',
            through: {
                attributes: []
            }
        }, Post
    ]});
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

//? /users/:id/posts

const setPost = catchError(async (req, res) => {
    //! 1 - Identificar el id
    const { id } = req.params;
    const user = await User.findByPk(id)
    if(!user) return res.json('No existe este usuario')

    //! 2 - Seteo los posts a Usuarios
    await user.setFavoritePosts(req.body)

    //! 3 - Obtener lo que se setea, con el objetivo de dar vista
    const posts = await user.getPosts()

    //! 4 - Final retorno
    return res.json(posts)
});


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