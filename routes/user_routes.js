const express = require("express")

require("dotenv").config()

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

const User = require("../model/User")

const router = express.Router()

const userController = require('../controllers/user_controller')

const { verifyUser } = require("../middlewares/auth")


router.post('/register', (req, res, next) => {
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user) return res.status(400).
                json({ error: "User already registered" })
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) return res.status(500).json({ error: err.message })
                const user = {
                    username: req.body.username,
                    password: hash,
                    fullname: req.body.fullname,
                    email: req.body.email,
                    phone: req.body.phone
                }
                User.create(user)
                    .then((user) =>  res.status(201).json({ message: "Registration sucessfull Done", success: true, data:user}))
                    .catch(next)
            })
        }).catch(next)
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body
    User.findOne({ username })
        .then(user => {
            if (!user) return res
                .status(401).json({ error: 'User is not registered' })
            bcrypt.compare(password, user.password, (err, success) => {
                if (err) return res.status(500).json({ error: err.message })
                if (!success) return res.status(401).json({ error: "Password doesn't match" })

                const payload = {
                    id: user._id,
                    username: user.username,
                    fullname: user.fullname,
                    role: user.role
                }

                jwt.sign(payload, process.env.SECRET, { expiresIn: '1d' }, (err, encoded) => {
                    if (err) res.status(500).json({ error: err.message })
                    res.json({
                        message: "Sucessfully LogIn ",
                        success: true,
                        username: user.username,
                        token: encoded,
                        id: id,
                        email: email,
                        role: role,
                    })
                })
            })
        }).catch(next)
})

router.put('/:id', verifyUser, userController.updateUser)
router.get('/showall', userController.showAllUser)
router.get('/single/:id', userController.getSingleUser)
router.get('/showProfile',verifyUser, userController.showProfile)

module.exports = router