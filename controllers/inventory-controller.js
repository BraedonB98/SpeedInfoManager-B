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
  const StoreItemList = [store.inventoryOrder]; //!need to make this the count order (condensed to a 1d array)

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
  res.json(count);
};

const countNext = async (req, res, next) => {
  const { pid, cid, counted } = req.body; //pid = part number cid = count id
  uid = req.userData._id;
  var count;
  try {
    count = await Count.findById(cid);
  } catch (error) {
    return next(new HttpError("Could not locate count ", 500));
  }
  if (count.toCount.length === 0) {
    if (count.postponed.length !== 0) {
      count.toCount = count.postponed;
    } else {
      return next(
        new HttpError("Count Already finished please submit finish count", 409)
      );
    }
  }
  if (count.toCount[0] !== pid) {
    return next(new HttpError("Part number is not the next to count", 406));
  }
  count.counted.push({ partNumber: pid, value: counted });
  count.toCount.shift();

  if (count.toCount.length === 0 && count.postponed.length === 0) {
    //!generate file and close count
  }
  try {
    await count.save();
  } catch (error) {
    return next(new HttpError("Count save failed", 500));
  }

  res.json(count);
};

const editEntireCount = async (req, res, next) => {};

const deleteCount = async (req, res, next) => {};

const postponeCount = async (req, res, next) => {
  const { pid, cid, counted } = req.body; //pid = part number cid = count id
  uid = req.userData._id;
  var count;
  try {
    count = await Count.findById(cid);
  } catch (error) {
    return next(new HttpError("Could not locate count ", 500));
  }
  if (count.toCount.length === 0) {
    new HttpError("No Item to postpone", 404);
  }
  if (count.toCount[0] !== pid) {
    return next(new HttpError("Part number is not the next to count", 406));
  }
  count.postponed.push(pid);
  count.toCount.shift();

  try {
    await count.save();
  } catch (error) {
    return next(new HttpError("Count save failed", 500));
  }
  res.json(count);
};

const getCount = async (req, res, next) => {
  const { cid } = req.body; // cid = count id
  uid = req.userData._id;
  var count;
  try {
    count = await Count.findById(cid);
  } catch (error) {
    return next(new HttpError("Could not locate count ", 500));
  }
  res.json(count);
};

const undoCount = async (req, res, next) => {
  const { pid, cid, counted } = req.body; //pid = part number cid = count id
  uid = req.userData._id;
  var count;
  try {
    count = await Count.findById(cid);
  } catch (error) {
    return next(new HttpError("Could not locate count ", 500));
  }
  if (count.counted.length === 0) {
    return next(new HttpError("No count to undo", 404));
  }
  count.toCount.unshift(pid);
  count.counted.pop();
  try {
    await count.save();
  } catch (error) {
    return next(new HttpError("Count save failed", 500));
  }
  res.json(count);
};

exports.createCount = createCount;
exports.countNext = countNext;
exports.editEntireCount = editEntireCount;
exports.deleteCount = deleteCount;
exports.postponeCount = postponeCount;
exports.getCount = getCount;
exports.undoCount = undoCount;
