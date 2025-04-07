const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const apiRoutes = require('./routers/router')
const connectDb = require('./config/db')
dotenv.config()

const PORT = process.env.PORT
const app = express()


app.use(cors())
app.use(express.json())
app.use('/api/routes', apiRoutes)


app.get('/', (req, res) => {
    res.json('Welcome to TIREDDEV 30 DAYS OF CODE CHALLENGE')
})


app.listen(PORT, () => {
    connectDb()
    console.log("SERVER RUNNING on PORT " + process.env.PORT)
    })