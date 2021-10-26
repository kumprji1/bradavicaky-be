const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Models
const User = require("../models/User");
const HttpError = require("../models/HttpError");

// Utils
const { Role } = require("../utils/roles");

exports.postLogin = async (req, res, next) => {
  // Finding user
  let user = null;
  try {
    user = await User.findOne({ username: req.body.username }).lean();
  } catch (err) {
    return next(new HttpError("Server cant reach database", 500));
  }

  // Stops loggining process if no user found
  if (!user)
    return next(new HttpError("No user exists with given username", 400));

  // Comparing passwords
  let isPasswordCorrect = false;
  try {
    isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
  } catch (err) {
    return next(new HttpError("Cannot compare password", 500));
  }

  // Stops loggining procces if password is incorrect
  if (!isPasswordCorrect) return next(new HttpError("Incorrect password", 401));

  // Generating token
  user.token = jwt.sign({
    username: user.username,
    name: user.name,
    surname: user.surname,
    role: user.role,
  },
  'harry_potter_secret_chamber');

  // Removing password before sending to client
  user.password = null;

  res.json(user);
};

exports.postRegisterAdmin = async (req, res, next) => {
  // Finding existing admin
  let existAdmin = false;
  try {
    existAdmin = await User.exists({ role: Role.ADMIN });
  } catch (err) {
    return next(new HttpError("Cannot find if admin already exists", 500));
  }

  // Only 1 admin is alowed
  if (existAdmin) return next(new HttpError("Admin already exists!", 401));

  // Comparing passwords
  if (req.body.password !== req.body.rePassword) return next(new HttpError("Passwords don't match!", 401));

  let hashedPassword = "";

  // Hashing password
  try {
    hashedPassword = await bcrypt.hash(req.body.password, 12);
  } catch (err) {
    return next(new HttpError("Password hasn't been hashed", 500));
  }

  const newAdmin = new User({
    name: req.body.name,
    surname: req.body.surname,
    username: req.body.username,
    password: hashedPassword,
    role: Role.ADMIN,
  });

  // Saving to the database
  try {
    await newAdmin.save();
  } catch (err) {
    return next(new HttpError("Nepodařilo se uložit učitele", 500));
  }

  res.json({msg: 'Admin created!'})
};
