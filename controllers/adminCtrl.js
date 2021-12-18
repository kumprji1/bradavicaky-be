const bcrypt = require("bcrypt");

// Models
const User = require("../models/User");
const HttpError = require("../models/HttpError");
const Product = require('../models/Product')
// Utils
const { Role } = require("../utils/roles");

exports.postRegisterPupil = async (req, res, next) => {
  // Finding existing user with given username
  let existsPupil = false;
  try {
    existsPupil = await User.exists({ username: req.body.username });
  } catch (err) {
    return next(new HttpError("Cannot retrieve data from database", 500));
  }

  // Username has to be unique
  if (existsPupil)
    return next(new HttpError("User with given username already exists", 401));

  // Comparing passwords
  if (req.body.password !== req.body.rePassword)
    return next(new HttpError("Passwords don't match!", 401));

  let hashedPassword = "";

  // Hashing password
  try {
    hashedPassword = await bcrypt.hash(req.body.password, 12);
  } catch (err) {
    return next(new HttpError("Password hasn't been hashed", 500));
  }

  const newPupil = new User({
    name: req.body.name,
    surname: req.body.surname,
    username: req.body.username,
    password: hashedPassword,
    role: Role.PUPIL,
    college: req.body.college,
    points: 0,
  });

  // Saving to the database
  try {
    await newPupil.save();
  } catch (err) {
    return next(new HttpError("Nepodařilo se uložit žáka", 500));
  }

  res.json({ msg: "Nový čaroděj mezi námi!" });
};

// Returns list of pupils
exports.getPupils = async (req, res, next) => {
  let pupils;
  try {
    pupils = await User.find({ role: Role.PUPIL }, "-password").lean();
  } catch (err) {
    return next(new HttpError("Nepodařilo se načíst čaroděje", 500));
  }
  res.json(pupils);
};

// Adds points to pupil (pupilsId, points)
exports.patchAddPointsById = async (req, res, next) => {
  // Updates pupils points like -> points += points;
  let pupil;
  try {
    pupil = await User.findOneAndUpdate(
      { _id: req.body.pupilsId },
      { $inc: { points: req.body.points } }
    );
  } catch (err) {
    return next(new HttpError("Nepodařilo se přidat body", 500));
  }
  res.json({msg: 'success', points: pupil.points + req.body.points})
};

// Removes points from pupil (pupilsId, points)
exports.patchRemovePointsById = async (req, res, next) => {
  // Updates pupils points like -> points -= points;
  let pupil;
  try {
    pupil = await User.findOneAndUpdate(
      { _id: req.body.pupilsId },
      { $inc: { points: -req.body.points } }
    );
  } catch (err) {
    return next(new HttpError("Nepodařilo se odebrat body", 500));
  }
  res.json({msg: 'success', points: pupil.points - req.body.points})
};

// Adds new product
exports.postAddProduct = async (req, res, next) => {
  const newProduct = new Product({
    title: req.body.title,
    photo: req.body.photo,
    desc: req.body.desc,
    price: req.body.price,
    quantity: req.body.quantity,
    isHidden: false,
    maxPiecesPerPupil: 0,
    owners: [],
    orderedBy: []
  })

  try {
    await newProduct.save()
  } catch (err) {
    return next(new HttpError("Nepodařilo se uložit produkt", 500));
  }

  res.json({ msg: 'success' });
};

