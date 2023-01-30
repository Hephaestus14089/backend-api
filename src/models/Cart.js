const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const cartSchema = new mongoose.Schema(
  {
    owner: {
      type: ObjectId,
      required: true,
      ref: 'User'
    },
    items: [{
      itemId: {
        type: ObjectId,
        required: true,
        ref: 'Item'
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
      },
      price: Number
    }],
    bill: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
