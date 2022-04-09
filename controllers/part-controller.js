//--------------------imports-------------------------
const mongoose = require("mongoose");
//------------------Modules--------------------------
const userController = require("../controllers/user-controller");
const getUserById = userController.getUserById;
//------------------Models------------------------------
const HttpError = require("../models/http-error");
const Part = require("../models/part-model");

//-----------------------HelperFunctions-----------------------

//----------------------Controllers-------------------------

const createPart = async (req, res, next) => {
  const { name, partNumber, imageUrl, description, notes } = req.body;
  uid = req.userData._id;
  let user = await getUserById(uid);
  if (!!user.error) {
    return next(new HttpError(user.errorMessage, user.errorCode));
  }
  let accessLevel = false;
  //checking if user has permission to create store
  user.permissions.map((permission) => {
    if (permission.storeId === "0" && permission.accessLevel === "admin") {
      accessLevel = true;
    }
  });
  if (!accessLevel) {
    return next(
      new HttpError("You dont have permission to create a part", 401)
    );
  }
  const part = new Part({
    name,
    partNumber,
    imageUrl,
    description,
    notes,
    status: "In Stock",
  });
  try {
    await part.save();
  } catch (error) {
    return next(new HttpError("Creating part failed", 500));
  }
  res.json(part);
};

const editPart = async (req, res, next) => {
  const { name, partNumber, imageUrl, description, notes, status } = req.body;
  uid = req.userData._id;
  let user = await getUserById(uid);
  if (!!user.error) {
    return next(new HttpError(user.errorMessage, user.errorCode));
  }
  let accessLevel = false;
  //checking if user has permission to create store
  user.permissions.map((permission) => {
    if (permission.storeId === "0" && permission.accessLevel === "admin") {
      accessLevel = true;
    }
  });
  if (!accessLevel) {
    return next(
      new HttpError("You dont have permission to create a part", 401)
    );
  }
  //getting part
  var part;
  try {
    part = await Part.findOne({ partNumber: partNumber });
  } catch (error) {
    new HttpError("Could not locate part", 404);
  }
  //updating part
  if (name) {
    part.name = name;
  }
  if (imageUrl) {
    part.imageUrl = imageUrl;
  }
  if (description) {
    part.description = description;
  }
  if (notes) {
    part.notes = notes;
  }
  if (status) {
    part.status = status;
  }
  // saving part
  try {
    await part.save();
  } catch (error) {
    return next(new HttpError("Creating part failed", 500));
  }
  res.json(part);
};

const deletePart = async (req, res, next) => {};

const getPart = async (req, res, next) => {
  const { name, partNumber, imageUrl, description, notes, status } = req.body;
  uid = req.userData._id;
  var part;
  try {
    part = await Part.findOne({ partNumber: partNumber });
  } catch (error) {
    new HttpError("Could not locate part", 404);
  }
  res.json(part);
};

exports.createPart = createPart;
exports.editPart = editPart;
exports.deletePart = deletePart; //!this will need high authorization clearance
exports.getPart = getPart;
