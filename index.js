const express = require('express')

const mongoose = require('mongoose')

const app = express()

const restaurant_routes = require('./routes/restaurant_routes')

const user_routes = require('./routes/user_routes')

const {verifyUser} = require('./middleware/auth')

const upload = require('./middleware/upload')


mongoose.connect('mongodb://127.0.0.1:27017/restaurantAPI')
.then(() => console.log('Connected to mongoDB server'))
.catch((err) => console.log(err))

app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send("Hello world")   
})

app.use('/restaurants',verifyUser ,restaurant_routes)
app.use('/users', user_routes)


app.post('/images', upload.single('photo'), (req,res) => {
    res.json(req.file)
})


app.use((err, req, res, next) => {
    console.error(err)
    if (err.name === 'ValidationError') res.status(400)
    else if (err.name === 'CastError') res.status(400)
    console.log(err.message)
    res.json({ error: err.message })
})

app.use((req, res) => {
    res.status(404).json({ error: "Path Not Found" })
})

app.listen(3000,() => {
    console.log('server is running on port 3000')
})