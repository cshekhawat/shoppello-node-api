const Cart = require("../models/cart.model");

const chainUpdates = (condition, action) => {
  return new Promise((resolve, reject) => {
    Cart.findOneAndUpdate(condition, action, { upsert: true })
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
};

exports.addItemToCart = (req, res) => {
  const {
    body: { cartItems },
    user: { _id: userId }
  } = req;
  Cart.findOne({ user: userId })
    .exec()
    .then(cart => {
      if (cart) {
        let promiseArray = [];

        cartItems.forEach(cartItem => {
          const product = cartItem.product;
          const item = cart.cartItems.find(x => x.product == product);
          let condition, action;
          if (item) {
            condition = { user: userId, "cartItems.product": product };
            action = {
              $set: {
                "cartItems.$": {
                  ...cartItem,
                  quantity: item.quantity + cartItem.quantity
                }
              }
            };
          } else {
            condition = { user: userId };
            action = {
              $push: {
                cartItems: cartItem
              }
            };
          }
          promiseArray.push(chainUpdates(condition, action));
        });
        Promise.all(promiseArray)
          .then(response => res.status(201).json({ response }))
          .catch(error => {
            console.log(error);
            res.status(400).json({ error });
          });
      } else {
        //if cart not exist then create a new cart
        const cart = new Cart({
          user: userId,
          cartItems: cartItems
        });
        cart
          .save()
          .then(response => {
            if (response) {
              return res.status(201).json({
                data: cart,
                status: "S",
                message: "Add cart items Success"
              });
            }
          })
          .catch(error => {
            return res
              .status(400)
              .json({ error, status: "E", message: "Add cart items failed" });
          });
      }
    })
    .catch(error => {
      return res
        .status(400)
        .json({ error, status: "E", message: "Add Cart items failed" });
    });
};

exports.getCartItems = (req, res) => {
  const {
    user: { _id: userId }
  } = req;
  Cart.findOne({ user: userId })
    .populate("cartItems.product", "_id name price productPictures")
    .exec()
    .then(cart => {
      if (cart) {
        let cartItems = {};
        cart.cartItems.forEach((item, index) => {
          cartItems[item.product._id.toString()] = {
            _id: item.product._id.toString(),
            name: item.product.name,
            img: item.product.productPictures[0].img,
            price: item.product.price,
            qty: item.quantity
          };
        });
        res.status(200).json({
          data: cartItems,
          status: "S",
          message: "Cart Items fetched successfully"
        });
      }
    })
    .catch(error => {
      return res
        .status(400)
        .json({ error, status: "E", message: "Cart items fetch failed" });
    });
};
