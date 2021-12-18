// Models
const User = require('../models/User')
const Product = require('../models/Product')
const HttpError = require('../models/HttpError')

// Returns points by username
exports.getPointsByUsername = async (req, res, next) => {
    let user = { points: 0};
    try {
        // Returns only userId and points
        user = await User.findOne({username: req.params.username}, 'points');
    } catch (err) {
        return next(new HttpError('Nepodařilo se načíst body', 500))
    }
    res.json(user);
}

// Returns avaible products for pupils to buy
exports.getAvaibleProducts = async (req, res, next) => {
    let products = [];
    try {
        products = await Product.find({isHidden: false});
    } catch (err) {
        return next(new HttpError('Nepodařilo se načíst produkty', 500))
    }
    res.json(products)
}

exports.postBuyProduct = async (req, res, next) => {
    const productId = req.params.productId;
    const pupilId = req.user.userId;
    let product;
    try {
        product = await Product.findById(productId).lean();
    } catch (err) {
        return next(new HttpError("Nepodařilo se načíst produkt", 500))
    }

    // If the product is not avaible
    if (product.isHidden) return next(new HttpError('Produkt není dostupný', 401))

    // If there are none left pieces → SOLD OUT
    if (product.quantity < 1) return next(new HttpError('Žádný kus ve sklepení nezbyl', 401))

    // If the count of pieces per pupil is limited
    // (unlimited → 0)
    if (product.maxPiecesPerPupil !== 0) {
    // How many times is already bought by cerain pupil
    // Počet výskytů id žáka v kolekcích preorderedBy a owners
    const boughtCountOfPupil = product.owners.filter(id => id == pupilId).length + product.preorderedBy.filter(id => id == pupilId).length
       
    // When pupil bought max pieces that he is allowed to, he can't buy more and he gets an error
    if (boughtCountOfPupil < product.maxPiecesPerPupil)
        return next(new HttpError('Byl dosažen maximální počet kusů k zakoupení tohoto zboží pro jednoho žáka', 401))
    }

    // lets preorder
}