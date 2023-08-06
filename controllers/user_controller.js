const User = require('../model/User')

exports.updateUser = (req, res, next) => {
    const { username, email, phone } = req.body;
    const id = req.params.id;

    User.updateOne({ _id: id }, { username: username, email: email, phone: phone })
        .then((data) => {
            res.status(200).json({ message: "User update sucessful" })
        }).catch(next)
}

exports.showAllUser = (req, res, next) => {
    User.find()
        .then((data) => {
            res.status(200).json({ success: true, data: data });
        }).catch(next)
}

exports.getSingleUser = (req, res, next) => {
    const id = req.params.id;
    User.findOne({ _id: id })
        .then((data) => {
            res.status(200).json({ success: true, data: data });
        }).catch(next)
}


exports.showProfile = (req, res, next) => {
    const id = req.user;
    User.findOne({ _id: id })
        .then((data) => {
            res.status(200).json({ success: true, data: data });
        }).catch(next)
}
