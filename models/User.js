const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,

      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Email is invalid");
      }
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,

      validate(value) {
        if (value.toLowerCase().includes('password'))
          throw new Error ("password must not contain password");
      }
    },
    tokens: [{
      token: {
        type: String,
        required: true,
      }
    }]
  },
  {
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
