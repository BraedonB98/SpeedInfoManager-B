//--------------------imports-------------------------

//------------------Modules--------------------------
const userController = require("./user-controller");
const getUserById = userController.getUserById;
const getCoordsForAddress = require("../util/location");
//------------------Models------------------------------
const HttpError = require("../models/http-error");
const Store = require("../models/store-model");
//-----------------------HelperFunctions-----------------------
const defaultInventoryOrder = [
  "059283",
  "059282",
  "059281",
  "059283RM",
  "059282RM",
  "059281RM",
  "059191",
  "059030",
  "059905",
  "059943",
  "059944",
  "060175",
  "060176",
  "059747",
  "059194",
  "059962",
  "059963",
  "059286",
  "059284",
  "059285",
  "059211",
  "059210",
  "059006",
  "059002",
  "060000",
  "059004",
  "060280",
  "059836",
  "059844",
  "059845",
  "059849",
  "059850",
  "059851",
  "059008",
  "059802",
  "059800",
  "059801",
  "059788",
  "059790",
  "059771",
  "059781",
  "059797",
  "059798",
  "059784",
  "059783",
  "059760",
  "059769",
  "059770",
  "059787",
  "059776",
  "059773",
  "059907",
  "059908",
  "059951",
  "059795",
  "059793",
  "059852",
  "059775",
  "059786",
  "059796",
  "059777",
  "059778",
  "059774",
  "059780",
  "059792",
  "059779",
  "059742",
  "059743",
  "059746",
  "059741",
  "059744",
  "059745",
  "059895",
  "SAK-6011-5-MED",
  "SAK-4510-5-HRD",
  "SAK-6011-5-HRD",
  "059635",
  "059633",
  "059636",
  "059632",
  "059864",
  "059868",
  "060271",
  "059630",
  "059513",
  "059515",
  "059514",
  "059512",
  "059511",
  "059731",
  "059735",
  "059720",
  "059723",
  "059726",
  "059725",
  "059728",
  "059734",
  "059733",
  "059694",
  "059682",
  "059693",
  "059692",
  "059695",
  "059688",
  "059698",
  "059696",
  "059685",
  "059681",
  "059680",
  "059691",
  "059687",
  "059686",
  "059683",
  "059377",
  "059378",
  "059372",
  "059371",
  "059370",
  "059373",
  "059374",
  "059010",
  "059019",
  "059014",
  "059017",
  "059016",
  "059015",
  "059012",
  "059013",
  "059018",
  "059232",
  "059243",
  "059239",
  "059236",
  "059224",
  "059237",
  "059611",
  "059594",
  "059602",
  "059200",
  "059204",
  "059203",
  "059671",
  "059669",
  "059662",
  "059663",
  "059661",
  "059654",
  "059672",
  "059668",
  "059651",
  "059650",
  "059653",
  "059660",
  "059893",
  "059664",
  "059656",
  "059658",
  "059569",
  "059337",
  "059446",
  "059449",
  "059447",
  "059441",
  "059451",
  "059357",
  "059442",
  "059440",
  "059440RM",
  "059332",
  "059350",
  "059339",
  "059867",
  "059346",
  "059334",
  "059344",
  "059358",
  "059343",
  "059354",
  "059338",
  "059478",
  "059484",
  "059489",
  "059459",
  "059491",
  "059461",
  "059482",
  "059490",
  "059485",
  "059486",
  "059487",
  "059496",
  "059463",
  "059477",
  "059462",
  "059492",
  "059468",
  "059469",
  "059480",
  "059488",
  "059472",
  "060283",
  "059457",
  "059453",
  "059456",
  "059473",
  "059404",
  "059405",
  "059178",
  "059118",
  "059110",
  "059179",
  "059180",
  "059502",
  "059811",
  "059813",
  "059810",
  "059812",
  "059758",
  "059752",
  "060274",
  "059865",
  "059754",
  "059750",
  "059753",
  "059755",
  "THR-TCTRC",
  "059700",
  "059701",
  "059709",
  "059713",
  "059714",
  "059702",
  "059306",
  "059305",
  "059307",
  "059312",
  "059313",
  "059314",
  "059317",
  "059318",
  "059319",
  "059320",
  "060289",
  "059311",
  "059315",
  "059309",
  "059300",
  "059308",
  "1204370",
  "059881",
  "059884",
  "059858",
  "059859",
  "059860",
  "059874",
  "059875",
  "059876",
  "059877",
  "059879",
  "059887",
  "059530",
  "059531",
  "059532",
  "059533",
  "059534",
  "059535",
  "059536",
  "059537",
  "059538",
  "059539",
  "059540",
  "059541",
  "059542",
  "059543",
  "059544",
  "059545",
  "059837",
  "059546",
  "059838",
  "059547",
  "059548",
  "059549",
  "059550",
  "059551",
  "059552",
  "059553",
  "059554",
  "059555",
  "059556",
  "059557",
  "059595",
  "059564",
  "059558",
  "059559",
  "059598",
  "059560",
  "059561",
  "059562",
  "059596",
  "059563",
  "059565",
  "059566",
  "059567",
  "059568",
  "059570",
  "059571",
  "059572",
  "059573",
  "059574",
  "059575",
  "059841",
  "059576",
  "059577",
  "059578",
  "059579",
  "059617",
  "059580",
  "059581",
  "059582",
  "059583",
  "059584",
  "059599",
  "059597",
  "059585",
  "059586",
  "059587",
  "059588",
  "059589",
  "059590",
  "059591",
  "059592",
  "059593",
];
//----------------------Controllers-------------------------

const createStore = async (req, res, next) => {
  const { name, address, notes } = req.body; //creator and users[0]= uid
  const uid = req.userData.id;
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
      new HttpError("You dont have permission to create a store", 401)
    );
  }
  //getting store number
  const storeNumber = (await Store.countDocuments({})) + 1;
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
    inventoryOrder: defaultInventoryOrder,
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

const getStore = async (req, res, next) => {
  const sid = req.params.sid; //creator and users[0]= uid
  const uid = req.userData.id;
  let user = await getUserById(uid);
  if (!!user.error) {
    return next(new HttpError(user.errorMessage, user.errorCode));
  }

  let accessLevel = false;
  //checking if user has permission to access all of store
  user.permissions.map((permission) => {
    if (
      (permission.storeId === "0" && permission.accessLevel === "admin") ||
      (permission.storeId === sid && permission.accessLevel === "mech") ||
      (permission.storeId === sid && permission.accessLevel === "admin")
    ) {
      accessLevel = true;
    }
  });
  var store;
  try {
    store = await Store.findOne({ storeNumber: sid });
  } catch (error) {
    return next(new HttpError("Could not locate store with store # ", 500));
  }
  //! later add it where they can get some info if they do not belong to store just not all
  if (!accessLevel) {
    return next(new HttpError("You dont have permission to access store", 401));
  }
  res.json(store);
};

exports.createStore = createStore;
exports.editStore = editStore;
exports.deleteStore = deleteStore;
exports.getStore = getStore;
