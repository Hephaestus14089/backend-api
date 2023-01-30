const express = require('express');
const User = require('../models/User');
const Auth = require('../middleware/auth');

const router = new express.Router();

// signup
router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    res.send({ user, token });
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

// logout
router.post('/users/logout', Auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );

    await req.user.save();
    res.send();
  }
  catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

// logout all
router.post('/users/logout-all', Auth, async (req, res) => {
  try {
    req.user.tokens = []; // clear the token array

    await req.user.save();
    res.send();
  }
  catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = router;
