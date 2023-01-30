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

// generate auth token (jwt)
userSchema.methods.generateAuthToken = async () => {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({token});
  await user.save();

  return token;
};

// hash plain-text password
userSchema.pre('save', async (cb_func) => {
  const user = this;

  if (user.isModified('password'))
    user.password = await bcrypt.hash(user.password, 8);

  cb_func(); // call back function
});

// fetch user
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not registered.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Password does not match.");

  return user;
}

const User = mongoose.model('User', userSchema);
module.exports = User;
