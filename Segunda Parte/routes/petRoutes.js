const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');

const verifyToken = require('../helpers/verify-token');


// Rotas de pets com autenticação
router.post('/create', verifyToken, petController.registerPet);
router.get('/', petController.getAllPets);
router.get('/mypets', verifyToken, petController.getUserPets);
router.get('/:id', petController.getPetById);
router.patch('/:id', verifyToken, petController.updatePet);
router.delete('/:id', verifyToken, petController.deletePet);
router.patch('/:id/schedule-visit', verifyToken, petController.scheduleVisit);
router.patch('/:id/complete-adoption', verifyToken, petController.completeAdoption);

module.exports = router;