const userModel = require("../model/userModel");

// login user
const loginController = async (req, res) => {
  try {
    const { userId, password } = req.body
    const user = await userModel.findOne({ userId, password, verified: true });
    if (user) {
      res.status(200).send(user);
    } else {
      res.json({
        message: ("Login Failed"),
        user,
      })
    }

  } catch (error) {
    console.log(error);
  }
};

// register user
const registerController = async (req, res) => {
  try {
    const newUser = new userModel({ ...req.body, verified: true });
    await newUser.save();
    res.status(201).send("New User Added Successfully!");
  } catch (error) {
    res.status(400).send("error", error);
    console.log(error);
  }
};



module.exports = { loginController, registerController };
