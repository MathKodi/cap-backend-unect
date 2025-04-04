const express = require('express')
const app = express()
const mongoose = require('mongoose')

require('dotenv').config()

//middlewares
app.use(
    express.urlencoded({
        extended: true,
    }), 
)

app.use(express.json())

///rotas da api
const studentsRoutes = require('./routes/studentsRoutes')
app.use('/students', studentsRoutes)

// rota inicial
app.get('/', (req, res) => {
    res.json({
        message: 'Hello World!',
    })
})

//
const DB_USER = process.env.DB_USER
const DB_PASS = encodeURIComponent(process.env.DB_PASS)

mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.fn6y1ts.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log('Conectou ao MongoDB')
    })
    .catch((err) => console.log(err))

app.listen(3000)