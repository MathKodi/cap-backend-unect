const router = require('express').Router()
const Student = require('../models/Student')

//criação dados
router.post('/', async (req, res) => {
    const { name, age, ra, cpf } = req.body

    if (!name || !age || !ra || !cpf) {
        return res.status(422).json({ error: 'Todos os campos são obrigatórios!' })
    }

    const student = {
        name,
        age,
        ra,
        cpf,
    }

    try {
        await Student.create(student)
        res.status(201).json({ message: 'Estudante criado com sucesso!' })
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//leitura de dados
router.get('/', async (req, res) => {
    try{
        const students = await Student.find()
        res.status(200).json(students)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

//leitura de dados por id
router.get('/:id', async (req, res) => {
    const id = req.params.id

    try {
        const student = await Student.findById(id)

        if (!student) {
            return res.status(422).json({ message: 'Usuário não encontrado!' })
        }

        res.status(200).json(student)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})  

//atualização de dados
router.patch('/:id', async (req, res) => {

    const id = req.params.id
    
    const { name, age, ra, cpf } = req.body

    const student = {
        name,
        age,
        ra,
        cpf,
    }

    try {
        const updateStudent = await Student.updateOne({ _id: id }, student)
        if (updateStudent.matchedCount === 0) {
            return res.status(422).json({ message: 'Usuário não encontrado!' })
        }
        res.status(200).json(student)
    } catch (error) {
        res.status(500).json({ error: error })
    }

}) 

//deletar dados
router.delete('/:id', async (req, res) => {
    const id = req.params.id
    const student = await Student.findById(id)

    if (!student) {
        return res.status(422).json({ message: 'Usuário não encontrado!' })
    }
    try {
        await Student.deleteOne({ _id: id })
        res.status(200).json({ message: 'Usuário removido com sucesso!' })  
    } catch (error) {
        res.status(500).json({ error: error })
    }

})
// leitura de dados com filtros por query (ra ou name)
router.get('/', async (req, res) => {
    const { ra, name } = req.query;

    let filter = {};

    if (ra) {
        filter.ra = ra;
    }

    if (name) {
        filter.name = { $regex: name, $options: 'i' };
    }

    try {
        const students = await Student.find(filter);
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

module.exports = router