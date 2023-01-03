const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once('open', (err) => {
  err
    ? console.log("Failed to connect to atlas db. \t\t :(")
    : console.log("Connected to atlas db. \t\t :)")
  ;
});
