const express = require('express');
const userRouter = require('./routes/user');
const itemRouter = require('./routes/item');
const cartRouter = require('./routes/cart');
require('./db/mongoose');

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(userRouter);
app.use(itemRouter);
app.use(cartRouter);

app.listen(port, () => {
  console.log("listening on port " + port + " ...");
});
