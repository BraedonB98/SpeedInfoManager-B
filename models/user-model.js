const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  preferredName: { type: String },
  //id
  jobCode: { type: String },
  imageUrl: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  password: { type: String },
  certifications: [{ type: String }],
  permissions: [{ type: String }],
});

module.exports = mongoose.model("User", userSchema);
