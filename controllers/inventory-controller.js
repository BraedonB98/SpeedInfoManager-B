//--------------------imports-------------------------
const mongoose = require("mongoose");
//const sgMail = require("@sendgrid/mail");
//sgMail.setApiKey(process.env.SendGridApi_Key);

//------------------Modules--------------------------

//------------------Models------------------------------
const HttpError = require("../models/http-error");
const Count = require("../models/count-model");
const Store = require("../models/store-model");

//-----------------------HelperFunctions-----------------------

//----------------------Controllers-------------------------

const createCount = async (req, res, next) => {
  //dont need to check for duplicates because they are ok
  const { name, sid, notes } = req.body; //creator and users[0]= uid
  uid = req.userData._id;

  //Get Store
  var store;
  try {
    store = await Store.findOne({ storeNumber: sid });
  } catch (error) {
    return next(new HttpError("Could not locate store with store # ", 500));
  }
  //!make sure user has credentials to open a count
  //making sure the store doest have an "open count"
  if (store.activeInventoryCount) {
    return next(
      new HttpError(
        "Already have an open inventory count, Please finish open count before proceeding",
        400
      )
    );
  }

  //Get Store Item List
  const StoreItemList = [store.inventoryOrder];

  //Create Count
  const count = new Count({
    name,
    creationDate: new Date(new Date().getTime()),
    editLog: [{ time: new Date(new Date().getTime()), user: uid }],
    creator: uid,
    userInteraction: [uid],
    notes,
    store: sid,
    status: {
      toCount: StoreItemList,
      counted: [], //nothing has been counted yet
      postponed: [], //nothing has been postponed yet
    },
  });

  //Sending new count to DB
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await count.save({ session: sess });
    store.activeInventoryCount = count._id;
    await store.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError("Creating count failed", 500));
  }
};

const countNext = async (req, res, next) => {};

const editEntireCount = async (req, res, next) => {};

const deleteCount = async (req, res, next) => {};

const postponeCount = async (req, res, next) => {};

const getCount = async (req, res, next) => {};

exports.createCount = createCount;
exports.countNext = countNext;
exports.editEntireCount = editEntireCount;
exports.deleteCount = deleteCount;
exports.postponeCount = postponeCount;
exports.getCount = getCount;
