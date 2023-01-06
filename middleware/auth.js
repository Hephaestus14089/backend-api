const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, cb_func) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) throw new Error;

    req.token = token;
    req.user = user;

    cb_func();
  }
  catch (err) {
    res.status(401).send({ error: "Authentication required" });
  }
};

module.exports = auth;
