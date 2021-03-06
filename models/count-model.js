const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const countSchema = new Schema({
  name: { type: String },
  creationDate: { type: Date },
  editLog: [
    { type: Date, type: mongoose.Types.ObjectId, ref: "User", type: String },
  ],
  //ID
  complete: [
    {
      partNumber: { type: String },
      description: { type: String },
      counted: { type: String },
      notes: { type: String },
    },
  ],
  creator: { type: mongoose.Types.ObjectId, ref: "User" },
  store: { type: mongoose.Types.ObjectId, ref: "Store" },
  notes: { type: String },
  status: {
    toCount: [{ type: String }], //to allow for various types of part numbers including with letters.
    //!- will then have a function that searches though database of parts for the one that is requested
    counted: [
      {
        partNumber: { type: String },
        value: { type: Number },
      },
    ],
    postponed: [{ type: String }],
  },
});

module.exports = mongoose.model("Count", countSchema);
