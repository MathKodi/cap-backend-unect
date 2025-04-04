const mongoose = require('mongoose');
const moment = require('moment');


const Student = mongoose.model('Student', {
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    ra: {
        type: String,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        default: () => moment().format('YYYY-MM-DD HH:mm:ss'),
    },
    updatedAt: {
        type: String,
        default: () => moment().format('YYYY-MM-DD HH:mm:ss'),
    },
});

 
module.exports = Student;