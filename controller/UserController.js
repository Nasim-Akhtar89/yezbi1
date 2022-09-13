const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.userSignUp = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new Error("Please enter an email address!");
  }

  if (!password) {
    throw new Error("Please enter a strong password!");
  }

  try {
    const oldUser = await User.findOne({ email: email }).exec();

    if (oldUser) {
      throw new Error("User already exist please login!");
    }

    const salt = bcrypt.genSaltSync(12);

    const encryptedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign({ user_id: newUser._id, email }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    newUser.token = token;

    await newUser.save();

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json(err.message);
  }
};

module.exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new Error("Please enter a valid email address!");
  }

  if (!password) {
    throw new Error("Please enter the password!");
  }

  try {
    const user = await User.findOne({ email: email }).exec();

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });

      user.token = token;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err.message);
  }
};
