// Models
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const HttpError = require("../models/HttpError");
const Vote = require("../models/Vote");

// Returns points by username
exports.getPointsByUsername = async (req, res, next) => {
  let user = { points: 0 };
  try {
    // Returns only userId and points
    user = await User.findOne({ username: req.params.username }, "points");
  } catch (err) {
    return next(new HttpError("Nepodařilo se načíst body", 500));
  }
  res.json(user);
};

// Returns avaible products for pupils to buy
exports.getAvaibleProducts = async (req, res, next) => {
  let products = [];
  try {
    // finds not hidden and with at least 1 piece left
    products = await Product.find({ isHidden: false, quantity: { $gt: 0 } });
  } catch (err) {
    return next(new HttpError("Nepodařilo se načíst produkty", 500));
  }
  res.json(products);
};

exports.postBuyProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const pupilId = req.user.userId;
  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    return next(new HttpError("Nepodařilo se načíst produkt", 500));
  }

  // If the product is not avaible
  if (product.isHidden)
    return next(new HttpError("Produkt není dostupný", 401));

  // If there are none left pieces → SOLD OUT
  if (product.quantity < 1)
    return next(new HttpError("Žádný kus ve sklepení nezbyl", 401));

  // If pupil does not have enough money (so find him and check it)
  let pupil;
  try {
    pupil = await User.findById(pupilId);
  } catch (err) {
    return next(new HttpError("Nepodařilo se načíst body žáka", 500));
  }
  if (pupil.points < product.price)
    return next(new HttpError("Málo bradavičáků", 401));

  // If the count of pieces per pupil is limited
  // (unlimited → 0)
  if (product.maxPiecesPerPupil !== 0) {
    // How many times is already bought by cerain pupil
    let orderedCount;
    try {
      orderedCount = await (
        await Order.find({ pupilId: pupilId, productId: productId })
      ).length;
    } catch (err) {
      return next(
        new HttpError("Nepodařilo se získat počet zakoupení produktu", 500)
      );
    }

    // When pupil bought max pieces that he is allowed to, he can't buy more and he gets an error
    if (orderedCount >= product.maxPiecesPerPupil)
      return next(
        new HttpError(
          "Byl dosažen maximální počet kusů k zakoupení tohoto zboží pro jednoho žáka",
          401
        )
      );
  }

  // Everything is OK, order proccess below ;)
  // Create new order
  const newOrder = new Order({
    pupilId: pupilId,
    productId: productId,
    orderedAt: new Date(),
    delivered: false,
  });

  // Push pupilId to orderedBy collection of product and decrement quantity
  product.orderedBy.push(pupilId);
  product.quantity--;

  // Push prodId to ordererProd of user and deduct points
  pupil.orderedProducts.push(productId);
  pupil.points -= product.price;

  try {
    // Bylo by vhodné použít transakci
    // Save new order
    await newOrder.save();
    // Save updated product
    await product.save();
    // Save updated pupil
    await pupil.save();
  } catch (err) {
    return next(new HttpError("Nepodařilo se koupit produkt.", 500));
  }

  res.json({ msg: "success" });
};

// Původní způsob
// exports.postBuyProduct = async (req, res, next) => {
//     const productId = req.params.productId;
//     const pupilId = req.user.userId;
//     let product;
//     try {
//         product = await Product.findById(productId).lean();
//     } catch (err) {
//         return next(new HttpError("Nepodařilo se načíst produkt", 500))
//     }

//     // If the product is not avaible
//     if (product.isHidden) return next(new HttpError('Produkt není dostupný', 401))

//     // If there are none left pieces → SOLD OUT
//     if (product.quantity < 1) return next(new HttpError('Žádný kus ve sklepení nezbyl', 401))

//     // If the count of pieces per pupil is limited
//     // (unlimited → 0)
//     if (product.maxPiecesPerPupil !== 0) {
//         // How many times is already bought by cerain pupil
//         // Počet výskytů id žáka v kolekcích preorderedBy a owners
//         const boughtCountOfPupil = product.owners.filter(id => id.toString() == pupilId).length + product.preorderedBy.filter(id => id.toString() == pupilId).length

//         // When pupil bought max pieces that he is allowed to, he can't buy more and he gets an error
//         if (boughtCountOfPupil === product.maxPiecesPerPupil)
//             return next(new HttpError('Byl dosažen maximální počet kusů k zakoupení tohoto zboží pro jednoho žáka', 401))
//     }

//     // lets preorder by putting pupils id into preorderedBy
//     try {
//         await Product.updateOne({ _id: productId}, { $push: { preorderedBy: pupilId}})
//     } catch (err) {
//         return next(new HttpError('Nepodařilo se koupit produkt.', 500))
//     }
// }

// Returns undelivered orders
exports.getUndeliveredOrders = async (req, res, next) => {
  const pupilId = req.params.pupilId;

  let orders;
  try {
    orders = await Order.find({ pupilId: pupilId, delivered: false }).populate(
      "productId"
    );
  } catch (err) {
    return next(
      new HttpError("Nepodařilo se načíst nedoručené objednávky", 500)
    );
  }

  res.json(orders);
};

exports.getDeliveredOrders = async (req, res, next) => {
  const pupilId = req.params.pupilId;

  let orders;
  try {
    orders = await Order.find({ pupilId: pupilId, delivered: true }).populate(
      "productId"
    );
  } catch (err) {
    return next(new HttpError("Nepodařilo se načíst doručené objednávky", 500));
  }
  res.json(orders);
};

exports.postRefundProduct = async (req, res, next) => {
  next();
};

exports.postVote = async (req, res, next) => {
  // Finds if pupil already voted on this question
  let existingVote;
  try {
    existingVote = await Vote.find({
      pupilId: req.body.pupilId,
      questionId: req.body.questionId,
    });
  } catch (err) {
    return next(
      new HttpError("Nepodařilo se zjistit, zda žák již hlasoval", 500)
    );
  }

  if (existingVote.length > 0)
    return next(new HttpError("Uživatel již hlasoval", 500));

  // vote
  const vote = new Vote({
    createdAt: new Date(),
    pupilId: req.body.pupilId,
    questionId: req.body.questionId,
    answerId: req.body.answerId,
  });
  try {
    await vote.save();
  } catch (err) {
    return next(new HttpError("Nepodařilo se hlasovat", 500));
  }
  res.json({ msg: "success" });
};

exports.getCanRoll = async (req, res, next) => {
  let canRoll;
  const now = new Date();
  try {
    const pupil = await User.findById(req.user.userId, "lastRoll");

    // If it's more then 24 hours, pupil can roll
    canRoll = (now - pupil.lastRoll) / (1000 * 60 * 60) > 24;
    console.log((now - pupil.lastRoll) / (1000 * 60 * 60) > 24);
  } catch (error) {
    return next("Nepodařilo se načíst datum posledního pokusu");
  }
  res.json({msg: 'success', canRoll: canRoll})
};

exports.postRoll = async (req, res, next) => {
  console.log('ROLL')
  let text = '';
  for(let i = 0; i<100; i++) {
    const points = Math.round(Math.random() * 4 - 1)
    if (points > 0) text = 'Získal jsi ' + points + ' B. Zkus to zase zítra ;)'
    if (points < 0) text = 'Přišel jsi o ' + -points + ' B. Zkus to zase zítra ;)'
    if (points == 0) text = 'Dneska nezískáváš, ani neztrácíš. Zkus to zase zítra ;)'
    // console.log('points: ', points, 'text: ', text)
  }
  try {
    // await User.findByIdAndUpdate(req.user.userId, { lastRoll: new Date() });
  } catch (error) {
    return next("Nepodařilo se uložit datum pokusu");
  }
  res.json({msg: 'success', text: text})
};
