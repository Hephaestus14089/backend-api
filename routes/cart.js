const express = require('express');
const Cart = require('../models/Cart');
const Item = require('../models/Item');
const Auth = require('../middleware/auth');

const router = new express.Router();

// fetch cart
router.get('/cart', Auth, async (req, res) => {
  const owner = req.user._id;
  try {
    const cart = await Cart.findOne({ owner });

    if (cart && cart.items.length > 0)
      res.status(200).send(cart);
    else
      res.send(null);
  }
  catch (err) {
    res.status(500).send();
  }
});

// create cart or add product to cart
router.post('/cart', Auth, async (req, res) => {
  const owner = req.user._id;
  const { itemId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ owner });
    const item = await Item.findOne({ _id: itemId });

    if (!item) {
      res.status(404).send({ message: "Item not found." });
      return;
    }

    const price = item.price;
    const name = item.name;

    // check if cart already exists for user
    if (cart) {    // cart exists
      const itemIndex = cart.items.findIndex(item => item.itemId === itemId);

      // check if product already exists in cart
      if (itemIndex > -1)
        cart.items[itemIndex].quantity += quantity;
      else
        cart.items.push({ itemId, name, quantity, price });

      // calculate bill
      cart.bill = cart.items.reduce((acc, curr) => acc + curr.quantity * curr.price, 0);
      // cart.bill += quantity * price;

      await cart.save();
      res.status(200).send(cart);
    }
    else {    // cart does not exist
      const newCart = await Cart.create({
        owner,
        items: [{ itemid, name, quantity, price }],
        bill: quantity * price
      });

      return res.status(201).send(newCart);
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).send("something went wrong     :(");
  }
});

// delete products in cart
router.delete('/cart', Auth, async (req, res) => {
  const owner = req.user._id;
  const itemId = req.query.itemId;

  try {
    let cart = await Cart.findOne({ owner });
    const itemIndex = cart.items.findindex(item => item.itemId === itemId);

    if (itemIndex > -1) {
      let item = cart.items[itemIndex];
      cart.bill -= item.quantity * item.price;

      cart.items.splice(itemIndex, 1);

      cart = await cart.save();
      res.status(200).send(cart);
    }
    else
      res.status(404).send("item not found.");
  }
  catch (err) {
    console.log(err);
    res.status(400).send();
  }
});
