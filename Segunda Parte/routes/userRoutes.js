const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const verifyToken = require('../helpers/verify-token');

router.get('/checkuser', userController.checkUser );
router.post('/register', userController.registerUser );
router.post('/login', userController.loginUser );
router.get('/:id', userController.getUserById);


router.patch('/update/:id', verifyToken, userController.updateUser );
router.delete('/delete/:id', verifyToken, userController.deleteUser );

module.exports = router;