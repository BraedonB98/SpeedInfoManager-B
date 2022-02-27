const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const storeSchema = new Schema({
  name: { type: String },
  //ID
  storeNumber: { type: String },
  imageUrl: { type: String },
  location: {
    address: { type: String },
    coordinates: { type: String },
  },
  countOrder: [[[{ type: String }]]], //3D array [Rack # (left to right), Shelve (from bottom to top), Position (left to right) ]
  inventoryOrder: [{ type: String }], //the order the excel sheet should be generated in
  notes: { type: String },
  status: { type: String }, //Discontinued, Out Of Stock, In Stock
  activeInventoryCount: { type: mongoose.Types.ObjectId, ref: "Count" },
  inventoryCountHistory: { type: mongoose.Types.ObjectId, ref: "Count" },
});

module.exports = mongoose.model("Store", storeSchema);
