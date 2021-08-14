const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "First name is missing"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is missing"],
  },
  email: {
    type: String,
    lowercase: true,
    index: { unique: true },
    required: [true, "Email can't be blank"],
    match: [/\S+@\S+\.\S+/, "Email is invalid"],
  },
  password: {
    type: String,
    required: [true, "Password cannot be empty"],
  },
});
const User = mongoose.model("User", userSchema);

module.exports = { User };
