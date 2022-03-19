//--------------------imports-------------------------

//------------------Modules--------------------------
const userController = require("./user-controller");
const getUserById = userController.getUserById;
const getCoordsForAddress = require("../util/location");
//------------------Models------------------------------
const HttpError = require("../models/http-error");
const Store = require("../models/store-model");
//-----------------------HelperFunctions-----------------------

//----------------------Controllers-------------------------

const createStore = async (req, res, next) => {
  const { name, storeNumber, address, notes } = req.body; //creator and users[0]= uid
  const uid = req.userData.id;
  let user = await getUserById(uid);
  console.log(user);
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
      new HttpError("You dont have permission to create a store", 401)
    );
  }
  //!need to turn location into coordinates with google api
  //Creating new store
  const createdStore = new Store({
    name,
    storeNumber,
    imageUrl: "data/uploads/images/default.svg",
    location: {
      address,
      coordinates: null,
    },
    countOrder: [],
    inventoryOrder: [],
    notes,
    activeInventoryCount: null,
    inventoryCountHistory: [],
  });
  //Sending new user to DB
  try {
    await createdStore.save();
  } catch (error) {
    return next(new HttpError("Creating store failed", 500));
  }
  res.json(createdStore);
};

const editStore = async (req, res, next) => {};

const deleteStore = async (req, res, next) => {};

const getStore = async (req, res, next) => {};

exports.createStore = createStore;
exports.editStore = editStore;
exports.deleteStore = deleteStore;
exports.getStore = getStore;
