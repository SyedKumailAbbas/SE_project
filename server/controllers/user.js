const jwt = require("jsonwebtoken");
const User = require("../models/User");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Bad request. Please add email and password in the request body",
    });
  }

  let foundUser = await User.findOne({ email: req.body.email });
  if (foundUser) {
    const isMatch = await foundUser.comparePassword(password);

    if (isMatch) {
      const token = jwt.sign(
        { role: foundUser.role, name: foundUser.name },
        process.env.JWT_SECRET,
        {
          expiresIn: "30d",
        }
      );

      return res.status(200).json({ msg: "user logged in", token });
    } else {
      return res.status(400).json({ msg: "Bad password" });
    }
  } else {
    return res.status(400).json({ msg: "Bad credentails" });
  }
};

const dashboard = async (req, res) => {

  res.status(200).json({
    name: req.user.name,
    role:req.user.role,
  });
};

const getAllUsers = async (req, res) => {
  let users = await User.find({});

  return res.status(200).json({ users });
};
const register = async (req, res) => {
  try {
    // Check if the email already exists
    let foundUserByEmail = await User.findOne({ email: req.body.email });
    if (foundUserByEmail) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    // Check if the username already exists
    let foundUserByUsername = await User.findOne({ name: req.body.username });
    if (foundUserByUsername) {
      return res.status(400).json({ msg: "Username already in use" });
    }

    // If both email and username are unique, proceed with registration
    let { username, email, password, role } = req.body;
    if (username.length && email.length && password.length) {
      const person = new User({
        name: username,
        email: email,
        password: password,
        role: role,
      });
      await person.save();
      return res.status(201).json({ person });
    } else {
      return res.status(400).json({ msg: "Please add all values in the request body" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};


module.exports = {
  login,
  register,
  dashboard,
  getAllUsers,
};
