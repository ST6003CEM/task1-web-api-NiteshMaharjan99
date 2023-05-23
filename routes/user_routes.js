const express = require("express")

require("dotenv").config()

const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

const User = require("../model/User")

const router = express.Router()


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
                    fullname: req.body.fullname
                }
                User.create(user)
                    .then((user) => res.status(201).json(user))
                    .catch(next)
            })
        }).catch(next)
})

module.exports = router