const mongoose = require('mongoose');
require('dotenv').config();
const DB_USER = process.env.DB_USER
const DB_PASS = encodeURIComponent(process.env.DB_PASS)
const connectDB = async () => {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.fn6y1ts.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
        .then(() => {
            console.log('Conectou ao MongoDB')
        })
        .catch((err) => console.log(err))
};

module.exports = connectDB;