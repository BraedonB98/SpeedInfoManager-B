const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const partSchema = new Schema({
  name: { type: String },
  //ID
  partNumber: { type: String },
  imageUrl: { type: String },
  description: { type: String },
  notes: { type: String },
  status: { type: String }, //Discontinued, Out Of Stock, In Stock
});

module.exports = mongoose.model("Part", partSchema);
