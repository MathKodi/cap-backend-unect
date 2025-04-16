const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//helpers
const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

// Cadastro de usuário
exports.registerUser  = async (req, res) => {
    const { name, email, password, phone, confirmpassword } = req.body;

    if (!name || !email || !password || !phone || !confirmpassword) {
        return res.status(422).json({ message: 'Todos os campos são obrigatórios...' });
    }

    if (password !== confirmpassword) {
        return res.status(422).json({ message: 'As senhas não coincidem...' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(422).json({ message: 'Email já cadastrado...' });
    }
    try{
        const user = new User({ name, email, password: hashedPassword, phone });
        await user.save();
        await createUserToken(user, req, res);
    } catch(err) {
        console.log(err);
        return res.status(500).json({ message: 'Erro ao cadastrar usuário' });
    }
    
};

// Login de usuário
exports.loginUser  = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ message: 'Todos os campos são obrigatórios...' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'credenciais invalidos' });
    }
    await createUserToken(user, req, res);
};

exports.checkUser = async (req, res) => {  
    let currentUser
    console.log(req.headers.authorization)
    if(req.headers.authorization) {
        const token = getToken(req)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        currentUser = await User.findById(decoded.id).select('-password')
    }
    if(!currentUser) {
        return res.status(401).json({ message: 'acesso negado' })
    }
    res.status(200).send({ currentUser })   
};

// Obter usuário por ID
exports.getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'usuario nao encontrado' });
    res.status(200).json({user});
};

// Atualizar usuário
exports.updateUser  = async (req, res) => {
    const id = req.params.id;
    const token = getToken(req);
    const userExists = await getUserByToken(token);
    if(userExists._id.toString() !== id) {
        return res.status(401).json({ message: 'Acesso negado!' });
    }

    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
        return res.status(422).json({ message: 'Todos os campos são obrigatórios...' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    userExists.password = hashedPassword;
    userExists.name = name;
    userExists.phone = phone;
    
    const user = await User.findOne({ email });

    if (userExists.email !== email && user) {
        res.status(422).json({ message: 'Email já cadastrado...' })
        return;
    }
    userExists.email = email;
    try{
        const userUpdated = await User.findByIdAndUpdate(id, userExists, { new: true });
        res.status(200).json({ userUpdated, message: 'Usuário atualizado com sucesso!' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }

};

// Excluir usuário
exports.deleteUser   = async (req, res) => {
    const id = req.params.id;
    const token = getToken(req);
    const userExists = await getUserByToken(token);
    if(userExists._id.toString() !== id) {
        return res.status(401).json({ message: 'Acesso negado! a' });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'usuario nao encontrado' });
    res.json({ message: 'usuario deletado com sucesso' });
};