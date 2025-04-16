const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./db/db');
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Conectar ao banco de dados
connectDB();

// Middleware
app.use(express.json()); 

// Rotas
app.use('/users', userRoutes);
app.use('/pets', petRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Server na porta: ${PORT}`);
});