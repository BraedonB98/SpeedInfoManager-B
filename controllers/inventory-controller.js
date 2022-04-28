//--------------------imports-------------------------
const mongoose = require("mongoose");
//const sgMail = require("@sendgrid/mail");
//sgMail.setApiKey(process.env.SendGridApi_Key);

//------------------Modules--------------------------
const userController = require("../controllers/user-controller");
const getUserById = userController.getUserById;
//------------------Models------------------------------
const HttpError = require("../models/http-error");
const Count = require("../models/count-model");
const Store = require("../models/store-model");
const {
  InviteContext,
} = require("twilio/lib/rest/chat/v1/service/channel/invite");

//-----------------------HelperFunctions-----------------------

//----------------------Controllers-------------------------

const createCount = async (req, res, next) => {
  //dont need to check for duplicates because they are ok
  const { name, sid, notes } = req.body; //creator and users[0]= uid
  uid = req.userData.id;

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
  const Store3DItemList = await store.countOrder;
  const StoreItemList = [];
  Store3DItemList.map((section) => {
    section.map((shelf) => {
      shelf.map((item) => {
        StoreItemList.push(item);
      });
    });
  });

  //Create Count
  const count = new Count({
    name,
    creationDate: new Date(),
    creator: uid,
    //notes,
    store: store._id,
    status: {
      toCount: StoreItemList,
      counted: [], //nothing has been counted yet
      postponed: [], //nothing has been postponed yet
    },
  });

  //Sending new count to DB
  try {
    const sess = await mongoose.startSession();
    await sess.startTransaction();
    await count.save({ session: sess });
    store.activeInventoryCount = count._id;
    await store.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    //console.log(error);
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
  if (count.status.toCount.length === 0) {
    if (count.status.postponed.length !== 0) {
      count.status.toCount = count.status.postponed;
    } else {
      return next(
        new HttpError("Count Already finished please submit finish count", 409)
      );
    }
  }
  if (count.status.toCount[0] !== pid) {
    return next(new HttpError("Part number is not the next to count", 406));
  }
  count.status.counted.push({ partNumber: pid, value: counted });
  count.status.toCount.shift();
  try {
    await count.save();
  } catch (error) {
    return next(new HttpError("Count save failed", 500));
  }
  if (count.status.toCount !== null) {
    res.json(count.status.toCount[0]);
  } else {
    res.json("Finished");
  }
};

const closeCount = async (req, res, next) => {
  //dont need to check for duplicates because they are ok
  const { sid } = req.body; //creator and users[0]= uid
  uid = req.userData.id;

  //Get Store
  var store;
  try {
    store = await Store.findOne({ storeNumber: sid });
  } catch (error) {
    return next(new HttpError("Could not locate store with store # ", 500));
  }
  //!make sure user has credentials to close a count
  //making sure the store doest have an "open count"
  if (!store.activeInventoryCount) {
    return next(
      new HttpError("You do not have an active inventory count", 400)
    );
  }

  store.inventoryCountHistory.push(store.activeInventoryCount);
  store.activeInventoryCount = null;
  //Sending new count to DB
  try {
    await store.save();
  } catch (error) {
    return next(new HttpError("Closing count failed", 500));
  }
  res.json(store);
};

const editEntireCount = async (req, res, next) => {};

const deleteCount = async (req, res, next) => {};

const postponeCount = async (req, res, next) => {
  const { pid, cid } = req.body; //pid = part number cid = count id
  uid = req.userData._id;
  var count;
  try {
    count = await Count.findById(cid);
  } catch (error) {
    return next(new HttpError("Could not locate count ", 500));
  }
  if (count.status.toCount.length === 0) {
    new HttpError("No Item to postpone", 404);
  }
  if (count.status.toCount[0] !== pid) {
    return next(new HttpError("Part number is not the next to count", 406));
  }
  // count.status.postponed.push(pid);
  // count.status.toCount.shift();
  count.status.postponed.push(count.status.toCount.shift());

  try {
    await count.save();
  } catch (error) {
    return next(new HttpError("Count save failed", 500));
  }
  res.json(count);
};

const getCount = async (req, res, next) => {
  const cid = req.params.cid;
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
  //removes previous nextCount
  const { cid } = req.body; //pid = part number cid = count id
  uid = req.userData._id;
  var count;
  try {
    count = await Count.findById(cid);
  } catch (error) {
    return next(new HttpError("Could not locate count ", 500));
  }
  if (count.status.counted.length === 0) {
    return next(new HttpError("No Previous Part", 400));
  }
  count.status.toCount.unshift(
    count.status.counted[count.status.counted.length - 1].partNumber //get the last part number in the counter array
  );
  count.status.counted.pop();
  try {
    await count.save();
  } catch (error) {
    return next(new HttpError("Count save failed", 500));
  }
  console.log(count.status.toCount[0]);
  res.json(count.status.toCount[0]);
};

exports.createCount = createCount;
exports.countNext = countNext;
exports.editEntireCount = editEntireCount;
exports.deleteCount = deleteCount;
exports.postponeCount = postponeCount;
exports.getCount = getCount;
exports.undoCount = undoCount;
exports.closeCount = closeCount;
