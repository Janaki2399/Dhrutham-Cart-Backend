const mongoose = require("mongoose");

function mongoDBConnection() {
  mongoose
    .connect(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => console.log("Connected to DB"))
    .catch((error) => console.log(error));
}

module.exports = { mongoDBConnection };
