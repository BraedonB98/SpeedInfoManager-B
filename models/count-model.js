const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const countSchema = new Schema({
  name: { type: String },
  //ID
  complete: {
    spreadSheetLocation: { type: String },
    variation: [{ type: String }],
  },
  creator: { type: mongoose.Types.ObjectId, ref: "User" },
  notes: { type: String, required: true },
  status: {
    toCount: [{ type: String }], //to allow for various types of part numbers includeing with letters.
    //!- will then have a function that searches though database of parts for the one that is requested
    counted: [{ type: String }],
    postponed: [{ type: String }],
  },
});

module.exports = mongoose.model("ToDoItem", toDoItemSchema);
