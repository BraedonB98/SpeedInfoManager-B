const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const countSchema = new Schema({
  name: { type: String },
  creationDate: { type: Date },
  editLog: [
    { type: Date, type: mongoose.Types.ObjectId, ref: "User", type: String },
  ],
  //ID
  complete: {
    spreadSheetLocation: { type: String },
    //variation: [{ type: String }], //I think I will want this stored in the store object
  },
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
