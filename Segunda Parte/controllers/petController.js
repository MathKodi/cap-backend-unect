const Pet = require('../models/Pet');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Cadastro de pet
exports.registerPet = async (req, res) => {
    const { name, age, weight, color } = req.body;
    const available = true;
    if (!name || !age || !weight || !color) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios... name, age, weight, color...' });
    }
    if (age < 0 || weight < 0) {
        return res.status(400).json({ message: 'Age and weight devem ser positivos' });
    }

    const token = getToken(req);

    const user = await getUserByToken(token);

    const pet = new Pet({ name, age, weight, color, user: {_id: user._id, name: user.name, phone: user.phone}, available });
    try{
        const newPet = await pet.save();
        res.status(201).json({ message: 'Pet registrado com sucesso', pet: newPet });
    } catch(err) {
        return res.status(500).json({ message: 'Erro ao cadastrar pet' });
    }
    
};

// Obter todos os pets
exports.getAllPets = async (req, res) => {
    const pets = await Pet.find().sort('-createdAt');
    res.status(200).json({pets: pets});
};

// Obter pets do usuário logado
exports.getUserPets = async (req, res) => {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt');
    
    res.status(200).json({ pets: pets });
};

// Obter pet por ID
exports.getPetById = async (req, res) => {
    const id = req.params.id;
   
    if (!ObjectId.isValid(id)) return res.status(422).json({ message: 'ID inválido' });
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: 'pet nao encontrado' });
    res.json(pet);
};




// Atualizar pet
exports.updatePet = async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) return res.status(422).json({ message: 'ID inválido' });
    const {name, age, weight, color, available} = req.body;
    const updatedData = {}

    if (!name || !age || !weight || !color) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios... name, age, weight, color...' });
    }
    else {
        updatedData.name = name;
        updatedData.age = age;
        updatedData.weight = weight;
        updatedData.color = color;
        updatedData.available = available;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    const pet = await Pet.findById(req.params.id);
    if (!pet || pet.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'não autorizado para atualizar este pet' });
    }
    const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedPet);
};

// Excluir pet
exports.deletePet = async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)){
        res.status(422).json({ message: 'ID inválido' });
        return
    }
    const token = getToken(req);
    const user = await getUserByToken(token);  

    const pet = await Pet.findById(id);
    if (!pet || pet.user._id.toString() !== user._id.toString()) {
        res.status(422).json({ message: 'Não autorizado para deletar' });
        return
    }
    
    await Pet.findByIdAndDelete(id);
    res.status(200).json({ message: 'Pet deletado' });
};

// Agendar visita
exports.scheduleVisit = async (req, res) => {

    const id = req.params.id;

    const pet = await Pet.findById(req.params.id);

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (!pet || pet.user._id.toString() === user._id.toString()) {
        return res.status(403).json({ message: 'não pode agendar uma visita para seu proprio pet' });
    }

    if(pet.adopter){
        if(pet.adopter._id.equals(user._id)){
            return res.status(422).json({ message: 'vc já agendou uma visita para este pet!' });
        }
        
    }
    pet.adopter = { _id: user._id, name: user.name, phone: user.phone }
    await Pet.findByIdAndUpdate(id, pet);
    res.status(200).json({ message: `A visita foi agendada com sucesso, entre contato com ${pet.user.name} pelo telefone ${pet.user.phone}`  });
};

// Concluir adoção
exports.completeAdoption = async (req, res) => {
    const id = req.params.id;
    const pet = await Pet.findById(id);

    const token = getToken(req);   
    const user = await getUserByToken(token);

    if (!pet || pet.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({ message: 'não autorizado para fazer adoção' });
    }
    pet.available = false;
    await Pet.findByIdAndUpdate(id, pet);
    res.json({ message: 'Adoção concluida com sucesso' });
};