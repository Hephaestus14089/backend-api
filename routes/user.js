const express = require('express');
const User = require('../models/User');

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
    res.status(400).send(err);
  }
});
