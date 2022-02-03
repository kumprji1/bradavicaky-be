const bcrypt = require("bcrypt");

// Models
const User = require("../models/User");
const HttpError = require("../models/HttpError");
const Product = require("../models/Product");
const Event = require('../models/Event')
const Question = require("../models/Question");
const Answer = require("../models/Answer");

// Utils
const { Role } = require("../utils/roles");
const Order = require("../models/Order");
const res = require("express/lib/response");

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
  res.json({ msg: "success", points: pupil.points + req.body.points });
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
  res.json({ msg: "success", points: pupil.points - req.body.points });
};

exports.getProducts = async (req, res, next) => {
  let products = [];
  try {
    products = await Product.find();
  } catch (err) {
    return next(new HttpError("Nepodařilo se načíst produkty", 500));
  }
  res.json(products);
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
    orderedBy: [],
  });

  try {
    await newProduct.save();
  } catch (err) {
    return next(new HttpError("Nepodařilo se uložit produkt", 500));
  }

  res.json({ msg: "success" });
};

// Returns undelivered products(for admin to deliver)
exports.getUndeliveredOrders = async (req, res, next) => {
  let orders = [];
  try {
    orders = await Order.find({ delivered: false }).populate(
      "pupilId productId"
    );
  } catch (err) {
    return next(new HttpError("Nepodařilo se načíst objednávky", 500));
  }
  res.json(orders);
};

// Delivers Order (Finishish order)
exports.patchDeliverOrder = async (req, res, next) => {
  let order;
  let pupil;
  let product;

  // Finding order and setting delivered to true
  try {
    order = await Order.findOneAndUpdate(
      { _id: req.params.orderId },
      // změnit na True a smazat komentář
      { delivered: true }
    );
  } catch (err) {
    return next(new HttpError("Nepodařilo se doručit objednávku", 500));
  }

  // Finds pupil
  try {
    pupil = await User.findById(order.pupilId);
    console.log("Pupil: ", pupil);
  } catch (err) {
    return next(new HttpError("Nepodařilo se najít žáka", 500));
  }

  // Finds product
  try {
    product = await Product.findById(order.productId);
    console.log("Product: ", product);
  } catch (err) {
    return next(new HttpError("Nepodařilo se najít produkt", 500));
  }

  // Adds IDs to product and pupil
  product.owners.push(order.pupilId);
  pupil.deliveredProducts.push(order.productId);

  try {
    await product.save();
    await pupil.save();
  } catch (err) {
    return next(new HttpError("Nepodařilo se doručit objednávku", 500));
  }

  res.json({ msg: "success" });
};


exports.postAddEvent = async (req, res, next) => {
  const event = new Event({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    createdAt: new Date()
  })

  try {
    await event.save()
  } catch (err) {
    return next(new HttpError('Nepodařilo se uložit událost', 500))
  }
  res.json({msg: 'success'})
}

exports.deleteEvent = async (req, res, next) => {
  try {
    await Event.deleteOne({_id: req.params.eventId})
  } catch (err) {
    return next(new HttpError('Nepodařilo se odstranit událost', 500))
  }
  res.json({msg: 'success'})
}

exports.addQuestion = async (req, res, next) => {
  const question = new Question({
    text: req.body.text,
    createdAt: new Date()
  })
  let result;
  try {
    result = await question.save()
  } catch (err) {
    return next(new HttpError('Nepodařilo se uložit otázku', 500))
  }
  console.log(result)
  res.json({msg: 'success', question: result})
}

exports.postCreateAnswer = async (req, res, next) => {
  const answer = new Answer({
    text: req.body.text,
    questionId: req.body.questionId,
    createdAt: new Date(),
    deleted: false
  })
  console.log(answer)
  let result;
  try {
    result = await answer.save()
  } catch (err) {
    return next(new HttpError('Nepodařilo se vytvořit odpověď', 500))
  }
  console.log(result)
  res.json({msg: 'success', answer: result})

}

exports.deleteAnswer = async (req, res, next) => {
  try {
    await Answer.findOneAndUpdate({_id: req.params.answerId}, {deleted: true})
  } catch (err) {
    return next(new HttpError('Nepodařilo se odstranit odpověď', 500))
  }
  res.json({msg: 'success'})
}
