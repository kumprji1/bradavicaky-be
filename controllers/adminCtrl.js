const bcrypt = require('bcrypt')

// Models
const User = require('../models/User')
const HttpError = require('../models/HttpError')

// Utils
const { Role } = require('../utils/roles');

exports.postRegisterPupil = async (req, res, next) => {
  // Finding existing user with given username
  let existsPupil = false;
  try {
    existsPupil = await User.exists({ username: req.body.username });
  } catch (err) {
    return next(new HttpError("Cannot retrieve data from database", 500));
  }

  // Username has to be unique
  if (existsPupil) return next(new HttpError("User with given username already exists", 401));

  // Comparing passwords
  if (req.body.password !== req.body.rePassword) return next(new HttpError("Passwords don't match!", 401));

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
  });

  // Saving to the database
  try {
    await newPupil.save();
  } catch (err) {
    return next(new HttpError("Nepodařilo se uložit žáka", 500));
  }

  res.json({msg: 'Pupil created!'})

}