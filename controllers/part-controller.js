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

//----------------------JSON----------------------------------
const partImportJSON = require("../json/partImport.json");

const createPart = async (req, res, next) => {
  const { name, partNumber, imageUrl, description, notes } = req.body;
  uid = req.userData.id;
  let user = await getUserById(uid);
  if (!!user.error) {
    return next(new HttpError(user.errorMessage, user.errorCode));
  }
  let accessLevel = false;
  //checking if user has permission to create part
  user.permissions.map((permission) => {
    if (permission.storeId === "0" && permission.accessLevel === "admin") {
      accessLevel = true;
    }
  });
  if (false) {
    //! this will need to be changed back to !accessLevel
    return next(
      new HttpError("You dont have permission to create a part", 401)
    );
  }

  //!make sure part is not already in data base!!!!!

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
  const partNumber = req.params.pid;
  uid = req.userData._id;
  console.log(partNumber);
  if (partNumber === undefined) {
    new HttpError("Please Provide a part number", 500);
  }
  var part;
  try {
    part = await Part.findOne({ partNumber: partNumber });
  } catch (error) {
    new HttpError("Could not locate part", 404);
  }
  res.json(part);
};

const importPart = async (req, res, next) => {
  const partImport = partImportJSON.partImport;
  //!does not currently check for duplicates
  partImport.map(async (part) => {
    const newPart = new Part({
      name: part[1],
      partNumber: part[0],
      description: part[0],
      notes: part[0],
      status: "In Stock",
    });
    try {
      await newPart.save();
      console.log(newPart.name);
    } catch (error) {
      console.log(error);
      return next(new HttpError("Creating part failed", 500));
    }
  });

  res.json(partImport);
};

exports.createPart = createPart;
exports.editPart = editPart;
exports.deletePart = deletePart; //!this will need high authorization clearance
exports.getPart = getPart;
exports.importPart = importPart;
