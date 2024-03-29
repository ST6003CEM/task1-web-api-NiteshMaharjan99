const express = require('express')
const mongoose = require('mongoose')
const app = express()
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const menu_routes = require('./routes/menu_routes')
const user_routes = require('./routes/user_routes')
const order_routes = require('./routes/order_routes')
const upload = require('./middlewares/upload')


mongoose.connect('mongodb://127.0.0.1:27017/restaurantAPI')
.then(() => console.log('Connected to mongoDB server'))
.catch((err) => console.log(err))

app.use(express.json())
app.use(express.static('public'))


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.get('/', (req, res) => {
    res.send("Hello world")   
})

//routes
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bills", require("./routes/billsRoute"));
app.use('/menus', menu_routes)
app.use('/orders', order_routes)
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

module.exports = app