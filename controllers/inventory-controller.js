//--------------------imports-------------------------
const mongoose = require("mongoose");
//const sgMail = require("@sendgrid/mail");
//sgMail.setApiKey(process.env.SendGridApi_Key);

//------------------Modules--------------------------

//------------------Models------------------------------
const HttpError = require("../models/http-error");
const Count = require("../models/count-model");

//-----------------------HelperFunctions-----------------------

//----------------------Controllers-------------------------

const createCount = async (req, res, next) => {
  //dont need to check for duplicates because they are ok
  const { name, sid, notes } = req.body; //creator and users[0]= uid
  uid = req.userData._id;
  //Find User
  // let user = await getUserById(uid);
  // if (!!user.error) {
  //   return next(new HttpError(user.errorMessage, user.errorCode));
  // }
  //Get Store

  //Get Store Item List
  const StoreItemList = []; //!Put store item list in this variable

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
      toCount: StoreItemList, //!list of all parts listed at store
      counted: [], //nothing has been counted yet
      postponed: [], //nothing has been postponed yet
    },
  });

  if (address) {
    let location;
    try {
      location = await getCoordsForAddress(address);
      newItem.address = location.address;
      newItem.location = location.coordinates;
    } catch (error) {
      return next(
        new HttpError("Could not access cordinates for that address", 502)
      );
    }
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
