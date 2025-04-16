const jwt = require('jsonwebtoken');

const createUserToken = async (user, req, res) => {
    const token = jwt.sign(
        {
            id: user._id,
            name: user.name,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1d',
        }
    );

    res.status(200).json({
        message: 'Você está autenticado',
        token: token,
        userId: user._id,
    });
}

module.exports = createUserToken;